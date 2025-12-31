# Fashion E-Commerce Platform with AI-Driven Fraud Detection

This project is a fashion e-commerce web application enhanced with an AI-driven fraud detection system during checkout.
The primary goal is to demonstrate how real-world e-commerce platforms detect and prevent fraudulent orders using both rule-based logic and AI (Gemini).

The application is currently developed and tested locally.

# Features
🛒 E-Commerce Core

Product listing from database

Dynamic cart drawer

Checkout flow

Payment method selection (COD, UPI, Card)

Order summary and pricing calculation

# Fraud Detection System (Main Focus)

Captures checkout behavioral signals:

Total order value

Number of items

Payment method

Digital vs physical products

User login status

Device & browser fingerprint

Rule-based fraud scoring as baseline

AI-powered risk evaluation using Google Gemini

Final fraud decision:

APPROVED

VERIFY

BLOCKED

Stores fraud evaluation results in database for analysis

# Authentication

User authentication using Supabase

Supports both:

Logged-in users

Guest checkout (user_id nullable)

# Tech Stack
# Frontend

Next.js (App Router)

React

Tailwind CSS

Framer Motion

# Backend

Next.js API Routes

Supabase (PostgreSQL + Auth)

Google Gemini AI (Fraud Risk Analysis)

# Database

PostgreSQL (via Supabase)

# Database Schema (Core Tables)
products

Stores all available products.

profiles

Stores authenticated user profiles.

checkout_events

Stores each checkout attempt with fraud analysis:

user_id (nullable)

total_amount

item_count

payment_method

has_digital_product

is_new_user

risk_level

decision

ai_reason

device & network metadata

# Fraud Detection Flow

User proceeds to checkout

Checkout data is collected

Rule-based risk score is calculated

Gemini AI analyzes the checkout context

Rule score and AI result are merged

Final decision is generated

Event is stored in database

UI reacts based on decision
