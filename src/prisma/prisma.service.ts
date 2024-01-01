import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get("DATABASE_URL"),
                }
            }
        })
    }
    

    //DELETING USER & BOOKMARK MANUALLY WHEN WORKING WITH D TESTING.
    cleanDb() {

        //$transaction it make things to b done accodelly
        //else USER can be deleted first before bookmark
        return this.$transaction([
            this.bookmark.deleteMany(),
            this.user.deleteMany()
        ]);
      
    }
}
