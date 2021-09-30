# importing required modules 
import os, random
from flask import Flask, render_template, request, redirect, url_for
import textract 


app = Flask(__name__)

UPLOAD_FOLDER = 'tmp/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# allow files of a specific type
ALLOWED_EXTENSIONS = set([ "csv", "doc", "docx", "eml", "epub", "gif", "htm", "html",
                            "jpeg", "jpg", "json", "log", "mp3", "msg", "odt", "ogg",
                            "pdf", "png", "pptx", "ps", "psv", "rtf", "tff", "tif", 
                            "tiff", "tsv", "txt", "wav", "xls", "xlsx"])

# function to check the file extension
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/favicon.ico')
def favicon():
    return redirect(url_for('static', filename='favicon.ico'))

@app.route('/')  
def index():  
    return render_template("file_upload_form.html")  


@app.route('/upload', methods = ['POST', 'GET'])  
def upload():  
    if request.method == 'POST':  
        if not request.files.get('files[]', None):
            return redirect(url_for("index"))
        else:
            content = []
            files = request.files.getlist('files[]')
            for file in files:
                file_id = random.randint(10000, 99999)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
                if file and allowed_file(file.filename):
                    file.save(file_path)
                    text = ""
                    try:
                        text = textract.process(file_path).decode("utf-8", "ignore")
                    except Exception as e:
                        text = str(e)
                    content.append({ "id": file_id, "name":file.filename, "type": file.content_type, "text": text })
                    os.remove(file_path)
                    file_id += 1
            return render_template("file_search_form.html", data=content)  
    else:
        return redirect(url_for("index"))

if __name__ == '__main__':
    app.run(debug=True, use_debugger=True, use_reloader=True)