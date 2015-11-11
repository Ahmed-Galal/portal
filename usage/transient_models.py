from django.db import models

class Allocation(models.Model):
	project = models.ForeignKey(Project)
    computeAllocated = models.IntegerField(default=-1)
    computeRequested = models.IntegerField(default=-1)
    dateRequested = models.DateField()
    dateReviewed = models.DateField()
    decisionSummary = models.CharField(max_length=200)
    endDate = models.DateField()
    id = models.IntegerField(default=-1)
    justification = models.CharField(max_length=200)
    memoryAllocated = models.DecimalField(default=-1.00, decimal_places=2)
    memoryRequested = models.DecimalField(default=-1.00, decimal_places=2)
    requestor = models.CharField(max_length=200)
    requestorId = models.IntegerField(default=-1)
    resource = models.CharField(max_length=200)
    resourceId = models.IntegerField(default=-1)
    reviewer = models.CharField(max_length=200)
    reviewerId = models.IntegerField(default=-1)
    startDate = models.DateField()
    status = models.CharField(max_length=200)
    storageAllocated = models.DecimalField(default=-1.00, decimal_places=2)
    storageRequested = models.DecimalField(default=-1.00, decimal_places=2)

class Project(models.Model):
	pi = models.ForeignKey(Pi)
    chargeCode = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    field = models.CharField(max_length=200)
    fieldId = models.IntegerField(default=-1)
    gId = models.IntegerField(default=-1)
    id = models.IntegerField(default=-1)
    source = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    type = models.CharField(max_length=200)
    typeId = models.IntegerField(default=-1)

class Pi(models.Model):
	citizenship = models.CharField(max_length=200)
	citizenshipId = models.CharField(max_length=200)
	country = models.CharField(max_length=200)
	countryId = models.IntegerField(default=0)
	department = models.CharField(max_length=200)
	departmentId = models.IntegerField(default=0)
	email = models.EmailField()
	firstName = models.CharField(max_length=200)
	id = models.IntegerField(default=-1)
	institution = models.CharField(max_length=200)
	institutionId = models.IntegerField(default=0)
	lastName = models.CharField(max_length=200)
	piEligibility = models.CharField(max_length=200)
	source = models.CharField(max_length=200)
	username = models.CharField(max_length=200)
