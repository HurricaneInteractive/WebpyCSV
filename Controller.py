import web
import csv
import json
import os
from hashlib import blake2b
import time

urls = (
    '/', 'Home',
    '/processCSV', 'ProcessCSV'
)

app = web.application(urls, globals())
render = web.template.render('Views/Templates', base="MainLayout")


class Home:
    def GET(self):
        return render.Home()


class ProcessCSV:
    def POST(self):
        file = web.input(csv_upload={}, delimiter={})
        print(file)
        data_lines = []
        t = str(int(time.time()))
        hashed_name = bytes('Hacked' + t, encoding='utf-8')
        file_hash = blake2b(hashed_name).hexdigest()
        ext = file["csv_upload"].filename.split('.')[-1]
        if ext != 'csv':
            return Exception('Wrong file extension!')
        
        with open('files/' + file_hash + '.csv', 'wb') as f:
            f.write(file['csv_upload'].value)
        
        with open('files/' + file_hash + '.csv', 'r') as csv_file:
            csv_reader = csv.DictReader(csv_file, delimiter=file['delimiter'])
            for row in csv_reader:
                data_lines.append(dict(row))
        
        os.remove('files/' + file_hash + '.csv')
        return json.dumps(data_lines)


if __name__ == '__main__':
    app.run()