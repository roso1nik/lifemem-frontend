## LIFEMEM_FRONTEND

есть проекты которые позволяют сохранить историю всей своей жизни в виде обычных заметок, как например это сделано в obsidian, но при этом главная фишка в графе, который автоматически строится между всем что ты сохранил (заметки, фотки, гео метки, музыка, даты, люди и вообще что угодно) и тем самым ты можешь на основе этого искать любой факт из своей жизни, затем его анализировать и составлять вообще статистику своей жизни и тд, что угодно можно придумать с этим

PROD BUILD: npm run build && npm run start

## Docker

docker build -f deploy/Dockerfile -t lifemem-frontend .

docker run -d --name lifemem-frontend -p 3004:3004 lifemem-frontend

docker stop lifemem-frontend

docker rm lifemem-frontend
