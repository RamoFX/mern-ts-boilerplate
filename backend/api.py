from flask import Flask, request, jsonify
from flask_cors import CORS

data = {
  'dummy': ['foo', 'bar']
}

app = Flask(__name__)
cors = CORS(app)



@app.route('/api/dummy', methods=['GET'])
def route_api_dummy():
  return jsonify(data['dummy'])



app.run(port = 8079)
