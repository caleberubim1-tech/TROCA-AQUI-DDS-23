//IMPORTAÇÂO DOS MÒDULOS NECESSÁRIOS PARA O FUNCIONAMENTO DO MULTER
const multer = require ('multer')
const path = require ('path')
const fs = require  ('fs')

//Configuração do diskStorage para o multer, onde as imagens serão armazenadas e como serão nomeadas
const storage = multer.diskStorage({
    //Definição da pasta destino
    destination: (req, file, cb) => {
        //Pasta reserva para caso dê errado o local certo
        let pastaDestino = 'gerais'
        //Dependendo da rota que chamar, encaminha a imagem para a pasta correta
        if (req.originalUrl.includes('/usuarios')) {
            pastaDestino = 'usuarios'
        }
        else if(req.originalUrl.includes('/produtos')) {
            pastaDestino = 'produtos'
        }
        //Variável que guarda o caminho da pasta principal de uploads
        const uploadPath = path.join(__dirname, '../../client/public/uploads/ $ {pastaDestino}')
        //Se não existir a pasta, o node tenta criar o módulo fs
        if(!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }
        //Função de callback do multer para definir o destino do upload
        cb(null, uploadPath)
    },
    //Função para alterar o nome do arquivo
    filename: (req, file, cb) => {
        //pega a data atual
        const timestamp = Date.now()
        //gera um numero aleatorio
        const numeroAleatorio = Math.round(Math.random() * 1E9)
        //paga a extensao
        const extensaoDoArquivo = path.extname(file.originalname)
        //Cria um nome final seguro para o arquivo, evitando conflitos de nomes
        const nomeFinalSeguro = `${timestamp}-${numeroAleatorio}${extensaoDoArquivo}`
        //Função de callback do multer para definir o nome do arquivo
        cb(null, nomeFinalSeguro)
    }
})
//Criação do middleware do multer com a configuração de armazenamento definida
const upload = multer({ storage : storage })
//Exportação do middleware para ser utilizado nas rotas que necessitam de upload de arquivos
module.exports = upload