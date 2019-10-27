# Patena-back-end

#Generar el archivo .env para la api key 
#en caso de falla (error Authentication)

*Borrar el archivo sendgrid.env
*Dentro de la carperta /services ejecutar

echo "export SENDGRID_API_KEY='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'" > sendgrid.env
echo "sendgrid.env" >> .gitignore
source ./sendgrid.env

