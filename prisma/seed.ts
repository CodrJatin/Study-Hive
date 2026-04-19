import { PrismaClient, HiveRole, TopicStatus, MaterialType, TrackType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  await prisma.trackTopic.deleteMany();
  await prisma.track.deleteMany();
  await prisma.material.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.deadline.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.hiveMember.deleteMany();
  await prisma.hive.deleteMany();
  await prisma.userTopicProgress.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding new data...');

  const user = await prisma.user.create({
    data: {
      id: "cm0x_mock_user_1",
      name: "Alex",
      email: "alex@example.com",
    }
  });

  const hive = await prisma.hive.create({
    data: {
      id: "cm0x_mock_hive_1",
      title: "Organic Chemistry",
      subject: "Chemistry",
      description: "Winter Semester 2024 Study Group",
      targetDate: new Date('2024-12-15T00:00:00.000Z'),
    }
  });

  await prisma.hiveMember.create({
    data: {
      userId: user.id,
      hiveId: hive.id,
      role: HiveRole.ADMIN,
    }
  });

  const unit1 = await prisma.unit.create({
    data: {
      title: "Foundations of Molecular Orbitals",
      hiveId: hive.id,
      position: 1,
    }
  });

  const unit2 = await prisma.unit.create({
    data: {
      title: "Advanced Studies",
      hiveId: hive.id,
      position: 2,
    }
  });

  const topic1 = await prisma.topic.create({
    data: {
      title: "Historical Contexts",
      unitId: unit1.id,
      position: 1,
    }
  });

  await prisma.userTopicProgress.create({
    data: {
      userId: user.id,
      topicId: topic1.id,
      status: TopicStatus.IN_PROGRESS,
    }
  });

  const topic2 = await prisma.topic.create({
    data: {
      title: "Institutional Standards",
      unitId: unit1.id,
      position: 2,
    }
  });

  await prisma.userTopicProgress.create({
    data: {
      userId: user.id,
      topicId: topic2.id,
      status: TopicStatus.NOT_STARTED,
    }
  });

  const topic3 = await prisma.topic.create({
    data: {
      title: "Symmetry Operations",
      unitId: unit2.id,
      position: 1,
    }
  });

  await prisma.userTopicProgress.create({
    data: {
      userId: user.id,
      topicId: topic3.id,
      status: TopicStatus.COMPLETED,
    }
  });

  // @ts-ignore
  await prisma.deadline.create({
    data: {
      title: "Stereochemistry Assignment",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
      hiveId: hive.id
    }
  });

  // @ts-ignore
  await prisma.deadline.create({
    data: {
      title: "Quiz: Reaction Mechanisms",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // Next week
      hiveId: hive.id
    }
  });

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
