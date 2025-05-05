📁 Project Structure
    spotify-app/
    ├── backend/       # Django backend
    └── frontend/      # React frontend
🚀 How to Run the Project
1. Clone the repository
    git clone https://github.com/NguyenDan0606/spotify-app.git
    cd spotify-app
2. Set up the backend
    a. Create and activate a virtual environment
        cd backend
        python3 -m venv env
        # Replace <python_version> and <env_name> with your values
        Activate on:
        🔹Windows (CMD): env\Scripts\activate
        🔹Windows (PowerShell): env\Scripts\Activate.ps1           
        🔹WSL / Linux / macOS: source env/bin/activate         
        To deactivate: deactivate
    b. Install Python dependencies: pip install -r requirements.txt
    c. Set up the database (MySQL)
        Make sure you have MySQL running and properly configured in your Django settings.py, then run:
        python manage.py makemigrations
        python manage.py migrate
    d. Run the backend server: python manage.py runserver
3. Set up the frontend
    cd ../frontend
    npm install
    Run the frontend server: npm run dev || yarn dev 



