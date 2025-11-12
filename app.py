from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
# Enable CORS for all routes (adjust origins in production)
CORS(app)


# Sample global items list (example data)
ITEMS = [
	{"id": 1, "name": "apple"},
	{"id": 2, "name": "banana"},
	{"id": 3, "name": "carrot"},
]


@app.route("/", methods=["GET"])
def index():
	return jsonify({"message": "Hello, world"})


@app.route("/echo", methods=["POST"])
def echo():
	"""Echo back JSON payload sent in the request body."""
	data = request.get_json(silent=True)
	if data is None:
		return jsonify({"error": "Invalid or missing JSON"}), 400
	return jsonify({"echo": data})


@app.route("/api/items", methods=["GET"])
def get_items():
	"""Return the sample ITEMS list as JSON."""
	return jsonify({"items": ITEMS})


if __name__ == "__main__":
	# Development server. In production, use a WSGI server like gunicorn.
	app.run(host="0.0.0.0", port=5000, debug=True)