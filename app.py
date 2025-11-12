from flask import Flask, jsonify, request
from flask_cors import CORS

# --- Application Setup ---
app = Flask(__name__)
# Enable CORS for all routes (important for front-end integration)
CORS(app)

# --- Global Data Stores (In-Memory) ---
ITEMS = [
    {"id": 1, "name": "apple"},
    {"id": 2, "name": "banana"},
    {"id": 3, "name": "carrot"},
]

# Student database (required for /api/students routes)
students = [
    {"id": 101, "name": "Alice", "grade": "A"},
    {"id": 102, "name": "Bob", "grade": "B"},
]
# Start next ID after the initial data
next_student_id = 103

# --- API Routes ---

@app.route("/", methods=["GET"])
def index():
    """Basic health check route."""
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

# --- Student CRUD Operations ---

@app.route("/api/students", methods=["GET"])
def get_students():
    """Return the current list of student records."""
    return jsonify({"students": students})

@app.route("/api/students", methods=["POST"])
def add_student():
    """Add a new student record."""
    data = request.get_json()
    if not data or "name" not in data or "grade" not in data:
        return jsonify({"error": "Missing name or grade"}), 400

    global next_student_id
    student = {
        "id": next_student_id,
        "name": data["name"],
        "grade": data["grade"]
    }
    students.append(student)
    next_student_id += 1
    return jsonify(student), 201

@app.route("/api/students/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):
    """Delete a student record by ID."""
    global students
    for i, student in enumerate(students):
        if student["id"] == student_id:
            students.pop(i)
            return jsonify({"message": f"Student {student_id} deleted"}), 200
    return jsonify({"error": f"Student {student_id} not found"}), 404

# --- Run the Application ---
if __name__ == "__main__":
    # Development server.
    app.run(host="0.0.0.0", port=8000, debug=True)