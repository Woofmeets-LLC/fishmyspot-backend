# FISH my Spot Backend

## ENV FILE AND SECRETS

Go to drive and download
`.env` and  `cloud-storage-service-account.json`

----
| :memo: | Take note of this |
| ------ | :---------------- |

Disclaimer: Only *allowed people* can view the [drive link](https://drive.google.com/drive/folders/1P1k93LB3NWUaUwsG_8Cui23L935do5yP?usp=sharing)

## Getting Started

1. Create a `.env` file in root

    ```lua
    PORT=3000
    DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:PORT/DATABASENAME?schema=public"
    GCS_SERVICE_KEY_PATH='./cloud-storage-service-account.json'
    GCS_BUCKET_NAME=''
    GCS_PROJECT_ID=''
    ```

2. Run `yarn`
3. Run `yarn dev` to start the development server
