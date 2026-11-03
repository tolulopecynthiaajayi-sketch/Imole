-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "stripe_customer_id" TEXT,
    "active_rental_status" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Kiosk" (
    "kiosk_id" TEXT NOT NULL PRIMARY KEY,
    "location_name" TEXT NOT NULL,
    "online_status" BOOLEAN NOT NULL DEFAULT true,
    "available_batteries" INTEGER NOT NULL DEFAULT 0,
    "empty_slots" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Battery" (
    "battery_id" TEXT NOT NULL PRIMARY KEY,
    "current_kiosk_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    CONSTRAINT "Battery_current_kiosk_id_fkey" FOREIGN KEY ("current_kiosk_id") REFERENCES "Kiosk" ("kiosk_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "transaction_id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "battery_id" TEXT NOT NULL,
    "start_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" DATETIME,
    "pre_auth_id" TEXT,
    "final_charge_amount" REAL,
    "status" TEXT NOT NULL DEFAULT 'PRE_AUTH_SUCCESS',
    CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_battery_id_fkey" FOREIGN KEY ("battery_id") REFERENCES "Battery" ("battery_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
