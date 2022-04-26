from django.db import models


class TableManager(models.Manager):

    def create_table(self, date, name, amount, distance):

        table = self.model(date=date, name=name,
                           amount=amount, distance=distance)
        table.save()
        return table
