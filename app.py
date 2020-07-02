from hashlib import sha256
from flask import Flask, render_template, url_for, request, session, redirect, jsonify, abort, send_file
from flask_pymongo import PyMongo, ObjectId
from gridfs import GridFS, NoFile

db_username = 'INSERT DB USERNAME'
db_password = 'INSERT DB PASSWORD'
cluster_name = 'INSERT CLUSTER NAME'
collection_name = 'INSERT COLLECTION NAME'
base_uri = f"CHECK MONGODB FOR URI AND USE F STRING TO COMPLETE WITH CREDENTIALS"
"""
EX:
mongodb+srv://{username}:{password}@{collection}-ad03.mongodb.net/{collection_name}?retryWrites=true&w=majority
"""
app = Flask(__name__)
app.secret_key = 'SECRET KEY'
Login = PyMongo(app, uri=base_uri)


"""helper funtion"""
def valid_creds(request):
   username = request.form.get('username')
   password = request.form.get('password')
   encoded_username = str(sha256(username.encode('utf-8')).hexdigest())
   encoded_password = str(sha256(password.encode('utf-8')).hexdigest())
   person = Login.db['UserPass'].find_one({"username": encoded_username})
   if person:
      if(person["password"] == encoded_password):
         return username



"""AKA login"""
@app.route('/', methods=['GET', 'POST'])
def index():
   logged_in = 0 #Assume not logged in
   failed_attempt = 0 #Assume not failed attempt

   if(session):
      logged_in=1

   if "form1" in request.form: #
      data = valid_creds(request)
      if data:
         session['db_uri'] = f"CHECK MONGODB FOR URI AND USE F STRING TO COMPLETE WITH CREDENTIALS. INSERT USERNAME INTO WHERE COLLECTION NAME WOULD GO."
         return redirect("/dashboard", code=302)
      else:
         failed_attempt = 1
   return render_template('index.html', failed_attempt = failed_attempt,logged_in = logged_in)



"""Code below """
@app.route('/dashboard/',methods=['GET','POST'])
def dashboard():
   if not session:
      return redirect("/", code=302)
   return render_template('dashboard.html')

"""Sends front-end all filenames"""
@app.route('/query', methods = ['POST'])
def query():
   if request.method == 'POST':
      connection = PyMongo(app, uri=session['db_uri']).db['fs.files']
      collection = connection.find({})
      data = []
      for record in collection:
         record['_id'] = str(record['_id'])
         data.append(record)
      return jsonify(data)

"""Upload file to database"""
@app.route('/upload', methods = ['POST'])
def upload():
   if 'file' in request.files:
      file = request.files["file"]
      PyMongo(app, uri = session['db_uri']).save_file(file.filename, file)
   return redirect(url_for('dashboard'), code = 302)

"""Logout"""
@app.route('/logout')
def logout():
   session.pop('db_uri', None)
   return redirect(url_for('index'), code = 302)

"""Downlaod file from server"""
@app.route('/download/<filename>')
def download(filename):
   storage = GridFS(PyMongo(app, uri=session['db_uri']).db)
   try:
      fileobj = storage.get_version(filename=filename, version=-1)
   except NoFile:
      abort(404)
   return send_file(fileobj,as_attachment=True, attachment_filename=filename,add_etags=True, cache_timeout=None, conditional=False, last_modified=None)

"""Delete file from database"""
@app.route('/delete/<file_id>')
def delete(file_id):
   storage = GridFS(PyMongo(app, uri=session['db_uri']).db)
   storage.delete(ObjectId(file_id))
   return redirect(url_for('dashboard'), code = 302)


if __name__ == '__main__':
   app.run(threaded=True, debug = True)
