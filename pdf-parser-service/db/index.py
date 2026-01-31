import asyncpg
import os
import json


pool: asyncpg.Pool | None = None

async def connect_db():
    global pool
    pool = await asyncpg.create_pool(
        database=os.getenv("PG_DATABASE"),
        user=os.getenv("PG_USER"),
        password=os.getenv("PG_PASSWORD"),
        host=os.getenv("PG_HOST"),
        port=int(os.getenv("PG_PORT")),
    )

    async with pool.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS orgData (
                id BIGSERIAL PRIMARY KEY,
                orgname TEXT NOT NULL,
                headings JSONB NOT NULL
            );
        """)
        print("TABLE READY")

async def insert_org(orgname: str, headings: dict):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO orgData (orgname, headings)
            VALUES ($1, $2)
            RETURNING id, orgname, headings
            """,
            orgname,
            json.dumps(headings)
        )
        return dict(row)

async def getorg_details(orgname:str):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT headings FROM orgData WHERE orgname = $1
            """,
            orgname
        )
        if row is None:
            return None
        return dict(row)
    
async def getpdf_details(orgname:str):
    async with pool.acquire() as conn:
        row = await conn.fetchval(
            """
            SELECT fullpdfdata FROM orgData WHERE orgname = $1
            """,
            orgname
        )
        if row is None:
            return None
    
        return json.loads(row)
 
async def addpdf_details(orgname: str, fullpdfdata: dict):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            UPDATE orgData SET fullpdfdata = $1 WHERE orgname = $2 RETURNING id, orgname, fullpdfdata
            """,
            json.dumps(fullpdfdata),
            orgname
        )
        if row is None:
            return None
        return dict(row)

async def getsku_rules(orgid: str):
    async with pool.acquire() as conn:
        row = await conn.fetchval(
            """
            SELECT rules, dimensions FROM orders WHERE orderid = $1
            """,
            orgid
        )
        if row is None:
            return None
        return json.loads(row)
    
async def addsku_rules(orgid: str, rules: dict, dimensions: dict):
    if rules is None or dimensions is None:
        raise ValueError("rules and dimensions cannot be null")

    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            UPDATE orders
            SET rules = $1, dimensions = $2
            WHERE orgid = $3
            RETURNING *
            """,
            rules,
            dimensions,
            orgid
        )

        if row is None:
            return None

        return row

    
async def close_db():
    await pool.close()
