import math

from rest_framework.exceptions import APIException

from .models import Table


dict_conditions = {
    '>': '__gt',
    '<': '__lt',
    '=': '',
    'in': '__contains',
}

dict_filter_names = {
    'Название': 'name',
    'Количество': 'amount',
    'Расстояние': 'distance',
}

dict_sort = {
    'asc': '',
    '': '',
    'desc': '-'
}


class HTTP400(APIException):

    status_code = 400


def do_filter(value, filter_name, condition):

    if len(value) > 19 and filter_name in ['Количество', 'Расстояние']:
        raise HTTP400(f'{value} слишком большое число')
    keyword = dict_filter_names[filter_name] + dict_conditions[condition]
    sorting_params_pack = {keyword: value}
    try:
        return Table.objects.filter(**sorting_params_pack)
    except ValueError:
        raise HTTP400(f'{filter_name} должно быть целым числом')


def do_sort(table, sort_by, sort_type):

    return table.order_by(dict_sort[sort_type] + dict_filter_names[sort_by])


def get_table_and_amount(data):

    limit = int(data['limit'])
    offset = int(data['offset'])
    value = data['value']
    if value:
        filter_name = data['filter_name']
        condition = data['condition']
        if condition and filter_name:
            table = do_filter(value, filter_name, condition)
        else:
            raise HTTP400(f'Укажите filter_name и condition')
    else:
        table = Table.objects.all()
    sort_type = data['sort_type']
    if sort_type:
        sort_by = data['sort_by']
        if sort_by:
            table = do_sort(table, sort_by, sort_type)
        else:
            raise HTTP400(f'Укажите sort_by')
    amount = math.ceil(len(table) / limit)
    return table[offset * limit:(offset + 1) * limit], amount
