-- CreateTable
CREATE TABLE "FunctionalityType" (
    "id" UUID NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "description" TEXT,
    "name" TEXT NOT NULL,

    CONSTRAINT "FunctionalityType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Functionality" (
    "id" UUID NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "description" TEXT,
    "name" TEXT NOT NULL,
    "path" TEXT,
    "icon" TEXT,
    "functionalityTypeId" UUID NOT NULL,

    CONSTRAINT "Functionality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" UUID NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "allow" BOOLEAN NOT NULL DEFAULT false,
    "userId" UUID NOT NULL,
    "functionalityId" UUID NOT NULL,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfilePermission" (
    "id" UUID NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "allow" BOOLEAN NOT NULL DEFAULT false,
    "profileId" UUID NOT NULL,
    "functionalityId" UUID NOT NULL,

    CONSTRAINT "ProfilePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" UUID NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" UUID NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserProfile" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_ApplicationProfile" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_UserApplication" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Functionality_functionalityTypeId_key" ON "Functionality"("functionalityTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_userId_key" ON "UserPermission"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_functionalityId_key" ON "UserPermission"("functionalityId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePermission_profileId_key" ON "ProfilePermission"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePermission_functionalityId_key" ON "ProfilePermission"("functionalityId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserProfile_AB_unique" ON "_UserProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_UserProfile_B_index" ON "_UserProfile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationProfile_AB_unique" ON "_ApplicationProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationProfile_B_index" ON "_ApplicationProfile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserApplication_AB_unique" ON "_UserApplication"("A", "B");

-- CreateIndex
CREATE INDEX "_UserApplication_B_index" ON "_UserApplication"("B");

-- AddForeignKey
ALTER TABLE "Functionality" ADD CONSTRAINT "Functionality_functionalityTypeId_fkey" FOREIGN KEY ("functionalityTypeId") REFERENCES "FunctionalityType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_functionalityId_fkey" FOREIGN KEY ("functionalityId") REFERENCES "Functionality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilePermission" ADD CONSTRAINT "ProfilePermission_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilePermission" ADD CONSTRAINT "ProfilePermission_functionalityId_fkey" FOREIGN KEY ("functionalityId") REFERENCES "Functionality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserProfile" ADD CONSTRAINT "_UserProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserProfile" ADD CONSTRAINT "_UserProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationProfile" ADD CONSTRAINT "_ApplicationProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationProfile" ADD CONSTRAINT "_ApplicationProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserApplication" ADD CONSTRAINT "_UserApplication_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserApplication" ADD CONSTRAINT "_UserApplication_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
