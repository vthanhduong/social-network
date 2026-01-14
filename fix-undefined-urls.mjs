import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixUndefinedUrls() {
  try {
    console.log('🔍 Checking for URLs with "undefined"...');

    // Check avatarUrls in User table
    const usersWithBadUrls = await prisma.user.findMany({
      where: {
        avatarUrl: {
          contains: '/undefined/',
        },
      },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
      },
    });

    if (usersWithBadUrls.length > 0) {
      console.log(`\n❌ Found ${usersWithBadUrls.length} users with bad avatar URLs:`);
      usersWithBadUrls.forEach(user => {
        console.log(`  - User: ${user.username}`);
        console.log(`    Current URL: ${user.avatarUrl}`);
        console.log(`    Fixed URL: ${user.avatarUrl.replace('/undefined/', '/zymtup5080/')}\n`);
      });

      // Fix the URLs
      for (const user of usersWithBadUrls) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            avatarUrl: user.avatarUrl.replace('/undefined/', '/zymtup5080/'),
          },
        });
      }
      console.log('✅ Fixed all user avatar URLs\n');
    } else {
      console.log('✅ No users with bad avatar URLs found\n');
    }

    // Check Media table
    const mediaWithBadUrls = await prisma.media.findMany({
      where: {
        url: {
          contains: '/undefined/',
        },
      },
      select: {
        id: true,
        url: true,
        type: true,
      },
    });

    if (mediaWithBadUrls.length > 0) {
      console.log(`\n❌ Found ${mediaWithBadUrls.length} media files with bad URLs:`);
      mediaWithBadUrls.forEach(media => {
        console.log(`  - Media ID: ${media.id} (${media.type})`);
        console.log(`    Current URL: ${media.url}`);
        console.log(`    Fixed URL: ${media.url.replace('/undefined/', '/zymtup5080/')}\n`);
      });

      // Fix the URLs
      for (const media of mediaWithBadUrls) {
        await prisma.media.update({
          where: { id: media.id },
          data: {
            url: media.url.replace('/undefined/', '/zymtup5080/'),
          },
        });
      }
      console.log('✅ Fixed all media URLs\n');
    } else {
      console.log('✅ No media with bad URLs found\n');
    }

    console.log('🎉 All done!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUndefinedUrls();
