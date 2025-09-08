-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gender" TEXT,
    "dob" TIMESTAMP(3),
    "mother_tongue" TEXT,
    "religion" TEXT,
    "merital_status" TEXT,
    "caste" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "employeeIn" TEXT,
    "family_type" TEXT,
    "father_occupation" TEXT,
    "mother_occupation" TEXT,
    "brother" INTEGER,
    "sister" INTEGER,
    "family_living" TEXT,
    "address" TEXT,
    "kyc" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");
