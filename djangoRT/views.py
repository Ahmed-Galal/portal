from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.core.servers.basehttp import FileWrapper
from django.core.urlresolvers import reverse
from djangoRT import rtUtil, forms, rtModels
from django.contrib.auth.decorators import login_required
from django.contrib import messages
import mimetypes

@login_required
def mytickets(request):
    rt = rtUtil.DjangoRt()
    show_resolved = 'show_resolved' in request.GET
    tickets = rt.getUserTickets(request.user.email, show_resolved=show_resolved)
    return render(request, 'ticketList.html', { 'tickets': tickets, 'show_resolved': show_resolved })

@login_required
def ticketdetail(request, ticketId):
    rt = rtUtil.DjangoRt()
    ticket = rt.getTicket(ticketId)
    ticket_history = rt.getTicketHistory(ticketId)
    return render(request, 'ticketDetail.html', { 'ticket' : ticket, 'ticket_history' : ticket_history, 'ticket_id' : ticketId, 'hasAccess' : rt.hasAccess(ticketId, request.user.email) })

def ticketcreate(request):
    rt = rtUtil.DjangoRt()

    data = {}
    if request.user.is_authenticated():
        data = { 'email' : request.user.email, 'first_name' : request.user.first_name, 'last_name' : request.user.last_name}
        header = "[Ticket created from Chameleon Portal by " + request.user.first_name + " " + request.user.last_name + " (" + request.user.email + ")]\n\n"
    else:
        return HttpResponseRedirect( reverse( 'djangoRT.views.ticketcreateguest'), )

    if request.method == 'POST':
        form = forms.TicketForm(request.POST, request.FILES)

        if form.is_valid():
            ticket = rtModels.Ticket(subject = form.cleaned_data['subject'],
                    problem_description = header + form.cleaned_data['problem_description'],
                    requestor = form.cleaned_data['email'],
                    cc = form.cleaned_data['cc'])
            ticket_id = rt.createTicket(ticket)

            if ticket_id > -1:
                if 'attachment' in request.FILES:
                    rt.replyToTicket(ticket_id, files=([request.FILES['attachment'].name, request.FILES['attachment'], mimetypes.guess_type(request.FILES['attachment'].name)],))
                return HttpResponseRedirect( reverse( 'djangoRT.views.ticketdetail', args=[ ticket_id ]) )
            else:
                # make this cleaner probably
                data['subject'] = ticket.subject
                data['problem_description'] = ticket.problem_description
                data['cc'] = ticket.cc
                form = forms.TicketForm(data)
    else:
        form = forms.TicketForm(initial=data)
    return render(request, 'ticketCreate.html', { 'form' : form })

def ticketcreateguest(request):
    rt = rtUtil.DjangoRt()

    data = {}
    if request.user.is_authenticated():
        return HttpResponseRedirect( reverse( 'djangoRT.views.ticketcreate'), )

    if request.method == 'POST':
        form = forms.TicketGuestForm(request.POST, request.FILES)

        if form.is_valid():
            ticket = rtModels.Ticket(subject = form.cleaned_data['subject'],
                    problem_description = form.cleaned_data['problem_description'],
                    requestor = form.cleaned_data['email'])
            ticket_id = rt.createTicket(ticket)

            if ticket_id > -1:
                if 'attachment' in request.FILES:
                    rt.replyToTicket(ticket_id, files=([request.FILES['attachment'].name, request.FILES['attachment'], mimetypes.guess_type(request.FILES['attachment'].name)],))
                messages.add_message(request, messages.SUCCESS, 'Ticket #%s has been successfully created. We will respond to your request as soon as possible.' % ticket_id)
                form = forms.TicketGuestForm()
                return render(request, 'ticketCreateGuest.html', { 'form': form })
            else:
                # make this cleaner probably
                messages.error('An unexpected error occurred while creating your ticket. Please try again.')
                data['first_name'] = form.cleaned_data['first_name']
                data['last_name'] = form.cleaned_data['last_name']
                data['requestor'] = ticket.requestor
                data['subject'] = ticket.subject
                data['problem_description'] = ticket.problem_description
                data['cc'] = ticket.cc
                form = forms.TicketGuestForm(data)
    else:
        form = forms.TicketGuestForm(initial=data)
    return render(request, 'ticketCreateGuest.html', { 'form' : form })

@login_required
def ticketreply(request, ticketId):
    rt = rtUtil.DjangoRt()

    ticket = rt.getTicket(ticketId)
    data = {}

    if request.method == 'POST':
        form = forms.ReplyForm(request.POST, request.FILES)

        if form.is_valid():
            if 'attachment' in request.FILES:
                if rt.replyToTicket(ticketId, text=form.cleaned_data['reply'], files=([request.FILES['attachment'].name, request.FILES['attachment'], mimetypes.guess_type(request.FILES['attachment'].name)],)):
                    return HttpResponseRedirect(reverse( 'djangoRT.views.ticketdetail', args=[ ticketId ] ) )
                else:
                    data['reply'] = form.cleaned_data['reply']
                    form = forms.ReplyForm(data)
            else:
                if rt.replyToTicket(ticketId, text=form.cleaned_data['reply']):
                    return HttpResponseRedirect(reverse( 'djangoRT.views.ticketdetail', args=[ ticketId ] ) )
                else:
                    data['reply'] = form.cleaned_data['reply']
                    form = forms.ReplyForm(data)

    else:
        form = forms.ReplyForm(initial=data)
    return render(request, 'ticketReply.html', { 'ticket_id' : ticketId , 'ticket' : ticket, 'form' : form, 'hasAccess' : rt.hasAccess(ticketId, request.user.email) })

@login_required
def ticketclose(request, ticketId):
    rtUtil.DjangoRt().closeTicket(ticketId)
    return HttpResponseRedirect(reverse( 'djangoRT.views.ticketdetail', args=[ ticketId ] ) )

@login_required
def ticketattachment(request, ticketId, attachmentId):
    title, attachment = rtUtil.DjangoRt().getAttachment(ticketId, attachmentId)
    if attachment['Headers']['Content-Disposition'] == 'inline':
        return render(request, 'attachment.html', {'attachment' : attachment['Content'], 'ticketId' : ticketId, 'title' : title});
    else:
        response = HttpResponse(attachment['Content'], content_type=attachment['Headers']['Content-Type'])
        response['Content-Disposition'] = attachment['Headers']['Content-Disposition'];
        return response;
