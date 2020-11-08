# Migration `20201108032953-weight-type--int----float`

This migration has been generated by nonissue at 11/7/2020, 8:29:53 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."weighins" ALTER COLUMN "weight" SET DATA TYPE Decimal(65,30) 
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201103210817-init-prod-db..20201108032953-weight-type--int----float
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider        = "prisma-client-js"
@@ -38,9 +38,9 @@
   id        Int      @id @default(autoincrement())
   createdAt DateTime @default(now()) @map(name: "created_at")
   updatedAt DateTime @default(now()) @map(name: "updated_at")
   weighDate DateTime
-  weight    Int
+  weight    Float
   personId Int?
   person   Person? @relation(fields: [personId], references: [id])
```

