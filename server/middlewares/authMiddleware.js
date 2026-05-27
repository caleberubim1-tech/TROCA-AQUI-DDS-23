const jwt = require("jsonwebtoken")

//verifica se existe algum token de acesso nos cookies da requisição
function verificarAutenticacao(req, res, next){
    const token = req.cookies?.token; // Obtém o token dos cookies

    //se não tiver token, redireciona para a página de login
    if(!token){
        return res.redirect("/login");
    }
    try{
        //verifica se o token é valido ou não 
        const dados = jwt.verify(token, process.env.JWT_SECRET);
        //se for valido, guarda os dados do token na requisição para usar depois
        req.usuario = dados;
        //deixa a requisição seguir para o próximo middleware ou rota
        res.locals.usuario = dados; // Disponibiliza os dados do usuário para as views
        next();
    } catch (error) {
        res.clearCookie("token"); // Limpa o token inválido dos cookies
        //se o token for invalido, redireciona para a página de login
        return res.redirect("/login");
    }
}

// FILTROS POR PERFIL
// Apenas adm
function somenteAdmin(req, res, next) {
    if(req.usuario.perfil !== "administrador"){
        return res.status(403).render('erro',
            { mensagem: "Acesso negado: Somente administradores" }
        )
    }
    next();
}
// Apenas ofertante
function somenteOfertante(req, res, next) {
    if(req.usuario.perfil !== "administrador" && req.usuario.perfil !== "ofertante"){
        return res.status(403).render('erro',
            { mensagem: "Acesso negado: Área para administradores e ofertantes" }
        )
    }

    next()
}

// Apenas interessados
function somenteInteressado(req, res, next){
    if(req.usuario.perfil !== "interessado"){
        return res.status(403).render('erro',
            { mensagem: "Acesso negado: Área exclusiva para interessados" }
        )
    }

    next()
}

//Área para interessados e ofertantes
function usuariosComuns(req, res, next){
     if(req.usuario.perfil !== "interessado" && req.usuario.perfil !== "ofertante"){
        return res.status(403).render('erro',
            { mensagem: "Acesso negado: Área exclusiva para interessados e ofertantes" }
        )
    }
    next()
}

module.exports = {
    verificarAutenticacao,
    somenteAdmin,
    somenteInteressado,
    somenteOfertante,
    usuariosComuns
}
