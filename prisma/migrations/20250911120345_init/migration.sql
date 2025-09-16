-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phone" TEXT,
    "gender" TEXT,
    "dob" TIMESTAMP(3),
    "mother_tongue" TEXT,
    "religion" TEXT,
    "marital_status" TEXT,
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
    "images" TEXT[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."likes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "likedUserId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."matches" (
    "id" SERIAL NOT NULL,
    "user1Id" INTEGER NOT NULL,
    "user2Id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chatrooms" (
    "id" SERIAL NOT NULL,
    "userOneId" INTEGER NOT NULL,
    "userTwoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_likedUserId_key" ON "public"."likes"("userId", "likedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "matches_user1Id_user2Id_key" ON "public"."matches"("user1Id", "user2Id");

-- CreateIndex
CREATE UNIQUE INDEX "chatrooms_userOneId_userTwoId_key" ON "public"."chatrooms"("userOneId", "userTwoId");

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_likedUserId_fkey" FOREIGN KEY ("likedUserId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."matches" ADD CONSTRAINT "matches_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."matches" ADD CONSTRAINT "matches_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chatrooms" ADD CONSTRAINT "chatrooms_userOneId_fkey" FOREIGN KEY ("userOneId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chatrooms" ADD CONSTRAINT "chatrooms_userTwoId_fkey" FOREIGN KEY ("userTwoId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."chatrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
