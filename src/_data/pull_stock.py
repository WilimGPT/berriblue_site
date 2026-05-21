import json

with open('artworks-for-sale.json', 'r') as f:
    data = json.load(f)

lines = []
for product_id, product in data.items():
    stock = product.get('Stock', 0)
    if stock is None:
        stock = 0
    lines.append(f"('{product_id}', {stock})")

sql = "INSERT INTO stock (product_id, stock_live) VALUES\n"
sql += ",\n".join(lines)
sql += ";"

with open('seed.sql', 'w') as f:
    f.write(sql)

print(f"Generated seed.sql with {len(lines)} products")