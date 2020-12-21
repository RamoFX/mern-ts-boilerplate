from flask import Flask, request
from flask_cors import CORS
import json

data = {
  'dummy': ['foo', 'bar']
}

app = Flask(__name__)
cors = CORS(app)



@app.route('/api/dummy', methods=['GET'])
def route_api_dummy():
  response = json.dumps(data['dummy'])
  return response



app.run(port = 8079)
