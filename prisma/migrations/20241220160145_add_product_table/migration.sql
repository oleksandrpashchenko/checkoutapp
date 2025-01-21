-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "triggeredId" TEXT NOT NULL,
    "triggeredTitle" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "offeredId" TEXT NOT NULL,
    "offeredTitle" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,
    "title" TEXT NOT NULL
);
