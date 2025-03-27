from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import  OAuth2PasswordRequestForm
import uvicorn

import db
import auth

app = FastAPI()

# Authentication Routes
@app.post("/api/auth/register")
async def register(user: db.User):
    existing_user = await db.db.users.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    user.password = auth.hash_password(user.password)
    await db.db.users.insert_one(user.dict())
    return {"message": "User registered"}

@app.post("/api/auth/login", response_model=db.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db.db.users.find_one({"username": form_data.username})
    if not user or not auth.verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = auth.create_access_token({"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

# Product Routes
@app.post("/api/products")
async def create_product(product: db.Product, user: dict = Depends(auth.get_current_user)):
    new_product = await db.db.products.insert_one(product.model_dump())
    return {"id": str(new_product.inserted_id), **product.model_dump()}

@app.get("/api/products")
async def get_products():
    products = await db.db.products.find().to_list(100)
    return products

@app.get("/api/products/{product_id}")
async def get_product(product_id: str):
    product = await db.db.products.find_one({"_id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.put("/api/products/{product_id}")
async def update_product(product_id: str, product: db.Product, user: dict = Depends(auth.get_current_user)):
    result = await db.db.products.update_one({"_id": product_id}, {"$set": product.model_dump()})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product updated"}

@app.delete("/api/products/{product_id}")
async def delete_product(product_id: str, user: dict = Depends(auth.get_current_user)):
    result = await db.db.products.delete_one({"_id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
