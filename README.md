# Natural Disaster Management Platform

This repository contains the source code of a full-stack web and mobile application for recording, managing, and visualizing natural disaster incidents.

## Project Structure

- `backend/`: Django and Django REST Framework backend API
- `web/`: React web administration interface
- `mobile/`: React Native mobile application

## Technologies

- Django
- Django REST Framework
- React
- React Native
- Redux
- Keycloak
- SQLite / PostgreSQL future extension
- Leaflet / React Leaflet

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

##Web Frontend Setup
cd web
npm install
npm start

##Mobile App Setup
cd mobile
npm install
npx react-native start
npx react-native run-android