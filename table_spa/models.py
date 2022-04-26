from django.db import models

from .managers import TableManager


class Table(models.Model):

    date = models.DateTimeField(auto_now_add=True, verbose_name='Дата')
    name = models.CharField(max_length=100, verbose_name='Название')
    amount = models.IntegerField(verbose_name='Количество')
    distance = models.FloatField(verbose_name='Расстояние')

    objects = TableManager()

    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name = 'table'
        verbose_name_plural = 'table'
        ordering = ['id']
