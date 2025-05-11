# Spotify App

A web application with Django backend and React frontend for interacting with Spotify data.

## 📁 Project Structure

```
spotify-app/
├── backend/    # Django backend
└── frontend/   # React frontend
```

## 🚀 How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/NguyenDan0606/spotify-app.git
cd spotify-app
```

### 2. Set up the backend

#### a. Create and activate a virtual environment

```bash
cd backend
python3 -m venv env
```

**Activate the virtual environment:**

- **Windows (CMD):** `env\Scripts\activate`
- **Windows (PowerShell):** `env\Scripts\Activate.ps1`
- **WSL / Linux / macOS:** `source env/bin/activate`

To deactivate: `deactivate`

#### b. Install Python dependencies:

```bash
pip install -r requirements.txt
```

#### c. Set up the database (MySQL)

Make sure you have MySQL running and properly configured in your Django `settings.py`, then run:

```bash
python manage.py makemigrations
python manage.py migrate
```

#### d. Run the backend server:

```bash
python manage.py runserver
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Run the frontend server:

```bash
npm run dev
# OR
yarn dev
```

## 💻 Technologies Used

- **Backend:** Django, Django REST Framework, MySQL
- **Frontend:** React
## 👥 Contributors
- (https://github.com/NguyenDan0606)
- (https://github.com/zidan63)
