import os
import sys
from datetime import datetime

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

from app import app, db, Category, Expense, BudgetLimit

def seed_data():
    with app.app_context():
        # Clean existing data
        db.drop_all()
        db.create_all()
        print("Database tables re-created.")

        # 1. Create Categories
        categories_data = [
            {"name": "Salary", "description": "Monthly paycheck", "color": "#10b981"}, # Green
            {"name": "Food & Dining", "description": "Groceries and restaurants", "color": "#f59e0b"}, # Amber
            {"name": "Rent & Housing", "description": "Rent and utility bills", "color": "#3b82f6"}, # Blue
            {"name": "Entertainment", "description": "Movies, games, events", "color": "#8b5cf6"}, # Purple
            {"name": "Transportation", "description": "Fuel, public transit, Uber", "color": "#ef4444"}, # Red
            {"name": "Shopping", "description": "Clothes, electronics, accessories", "color": "#ec4899"}, # Pink
            {"name": "Investments", "description": "Mutual funds, stocks", "color": "#06b6d4"} # Cyan
        ]

        categories = {}
        for cat_info in categories_data:
            cat = Category(
                name=cat_info["name"],
                description=cat_info["description"],
                color=cat_info["color"]
            )
            db.session.add(cat)
            categories[cat_info["name"]] = cat
        
        db.session.commit()
        print("Categories seeded successfully.")

        # 2. Set Budget Limits for Current Month (July 2026) and Previous Month (June 2026)
        budget_limits = [
            {"category": "Food & Dining", "amount": 5000.0, "month": 7, "year": 2026},
            {"category": "Food & Dining", "amount": 5000.0, "month": 6, "year": 2026},
            {"category": "Entertainment", "amount": 2000.0, "month": 7, "year": 2026},
            {"category": "Transportation", "amount": 1500.0, "month": 7, "year": 2026},
            {"category": "Shopping", "amount": 4000.0, "month": 7, "year": 2026}
        ]

        for budget in budget_limits:
            limit = BudgetLimit(
                category_id=categories[budget["category"]].id,
                amount=budget["amount"],
                month=budget["month"],
                year=budget["year"]
            )
            db.session.add(limit)
        
        db.session.commit()
        print("Budget limits seeded.")

        # 3. Create Expenses and Incomes (June & July 2026)
        transactions = [
            # Incomes (July 2026)
            {"description": "Regular Paycheck", "amount": 50000.0, "category": "Salary", "type": "income", "date": datetime(2026, 7, 1), "tags": "salary,monthly"},
            {"description": "Freelance Project", "amount": 8500.0, "category": "Salary", "type": "income", "date": datetime(2026, 7, 10), "tags": "freelance,side-hustle"},
            
            # Expenses (July 2026)
            {"description": "Apartment Rent", "amount": 15000.0, "category": "Rent & Housing", "type": "expense", "date": datetime(2026, 7, 1), "tags": "rent"},
            {"description": "Weekly Groceries", "amount": 1200.0, "category": "Food & Dining", "type": "expense", "date": datetime(2026, 7, 3), "tags": "groceries"},
            {"description": "Netflix Subscription", "amount": 199.0, "category": "Entertainment", "type": "expense", "date": datetime(2026, 7, 5), "tags": "subscription,streaming"},
            {"description": "Gas Station", "amount": 800.0, "category": "Transportation", "type": "expense", "date": datetime(2026, 7, 6), "tags": "fuel"},
            {"description": "Dinner with friends", "amount": 1500.0, "category": "Food & Dining", "type": "expense", "date": datetime(2026, 7, 8), "tags": "restaurant"},
            {"description": "New Headphones", "amount": 3500.0, "category": "Shopping", "type": "expense", "date": datetime(2026, 7, 9), "tags": "electronics"},
            {"description": "Electric Bill", "amount": 2200.0, "category": "Rent & Housing", "type": "expense", "date": datetime(2026, 7, 11), "tags": "utilities"},
            {"description": "Movie Ticket", "amount": 350.0, "category": "Entertainment", "type": "expense", "date": datetime(2026, 7, 12), "tags": "cinema"},
            {"description": "Weekly Groceries", "amount": 1400.0, "category": "Food & Dining", "type": "expense", "date": datetime(2026, 7, 13), "tags": "groceries"},

            # Incomes (June 2026)
            {"description": "Regular Paycheck", "amount": 50000.0, "category": "Salary", "type": "income", "date": datetime(2026, 6, 1), "tags": "salary"},
            
            # Expenses (June 2026)
            {"description": "Apartment Rent", "amount": 15000.0, "category": "Rent & Housing", "type": "expense", "date": datetime(2026, 6, 1), "tags": "rent"},
            {"description": "Groceries", "amount": 4500.0, "category": "Food & Dining", "type": "expense", "date": datetime(2026, 6, 10), "tags": "groceries"},
            {"description": "Electricity Bill", "amount": 2000.0, "category": "Rent & Housing", "type": "expense", "date": datetime(2026, 6, 12), "tags": "utilities"},
            {"description": "Dinner Out", "amount": 1200.0, "category": "Food & Dining", "type": "expense", "date": datetime(2026, 6, 15), "tags": "restaurant"},
            {"description": "Bus Pass", "amount": 600.0, "category": "Transportation", "type": "expense", "date": datetime(2026, 6, 20), "tags": "commute"}
        ]

        for tx in transactions:
            expense = Expense(
                description=tx["description"],
                amount=tx["amount"],
                category_id=categories[tx["category"]].id,
                type=tx["type"],
                tags=tx["tags"],
                date=tx["date"]
            )
            db.session.add(expense)
            
        db.session.commit()
        print("Transactions seeded successfully!")

if __name__ == "__main__":
    seed_data()
