const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Configuração de armazenamento do multer usando disco
const storage = multer.diskStorage({
    // destination define o diretório onde o arquivo será salvo
    destination: function(req, file, cb){

        // pasta padrão para uploads que não sejam de usuários ou produtos
        let pastaDestino = 'gerais'

        // Se a URL da requisição contiver /usuarios, salva em uploads/usuarios
        if(req.originalUrl.includes('/usuarios')){
            pastaDestino = 'usuarios'
        }
        // Se a URL da requisição contiver /produtos, salva em uploads/produtos
        else if(req.originalUrl.includes('/produtos')){
            pastaDestino = 'produtos'
        }

        // Cria o caminho completo relativo ao arquivo atual
        const uploadPath = path.join(__dirname, `../../client/public/uploads/${pastaDestino}`)

        // Se a pasta não existir, cria ela e todas as pastas necessárias
        if(!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }

        // Chama o callback passando null para erro e o caminho de destino
        cb(null, uploadPath)
    },

    // filename define o nome final do arquivo salvo
    filename: (req, file, cb) =>{
        // Usa o timestamp atual para evitar nomes iguais
        const timestamp = Date.now()
        // Acrescenta um número aleatório para aumentar a chance de nome único
        const numeroAleatorio = Math.round(Math.random() * 1E9)
        // Mantém a extensão original do arquivo enviado
        const extensaoDoArquivo = path.extname(file.originalname)

        // Nome final do arquivo com timestamp, número aleatório e extensão
        const nomeFinalSeguro = `${timestamp}-${numeroAleatorio}${extensaoDoArquivo}`

        // Chama o callback passando null para erro e o nome do arquivo
        cb(null, nomeFinalSeguro)
    }
})

// Cria o middleware de upload usando o storage configurado
const upload = multer({ storage: storage })

// Exporta o middleware para uso em outras partes da aplicação
module.exports = upload