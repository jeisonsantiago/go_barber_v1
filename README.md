# go_barber_v1
First Project with Node.js/typescript from GoStack bootcamp (RocketSeat)

# -------MACRO--------

# Recuperacao de senha
**RF(requisitos funcionais)**
- O usuario deve poder recuperar sua senha via email;
- Usuario recebe email com instrucao de recuperacao de senha;
- o usuario deve poder resetar senha;

**RNF(requisitos nao funcionais)**
- Utilizar Mailtrap pra testar envios em ambiente de dev;
- Utilizar Amazon SES para envios em producao;
- Envio de emails deve acontecer em background;

**RN(regras de negocio)**

- O link de recuperacao de senha deve expirar em 2h
- Usuario precisa confirmar senha 2x pra confirmar alteracao


# Atualizacao Do Perfil
**RF(requisitos funcionais)**
- O usuario deve poder atualizar perfil (email,nome, senha)

**RNF(requisitos nao funcionais)**

**RN(regras de negocio)**
- Usuario nao pode alterar email pra um email ja utilizado;
- Para atualizar senha usuario deve informar senha antiga;
- Usuario precisa confirmar a nova senha 2x;


# Painel do Prestador do servico
**RF(requisitos funcionais)**
- Usuario deve poder listar agendamentos do dia especifico;
- Prestador deve receber notificacao a cada novo agendamento;
- Prestador deve poder visualizar notificacoes nao lidas;

**RNF(requisitos nao funcionais)**
- Agendamentos do prestador no dia armazenados em CACHE;
- Notificacoes do prestador devem ser armazenadas em MongoDB;
- Notificacoes do prestador deve ser enviadas em tempo-real utilizando Socket.io;

**RN(regras de negocio)**
- Notificacao deve ter status de lida ou nao lida;


# Agendamento de servicoes
**RF(requisitos funcionais)**
- Usuario deve poder listar prestadores de servicos;
- Usuario deve poder vizualizar os dias/horarios disponiveis por prestador especifico;
- Usuario deve poder realizar agendamento com prestador;

**RNF(requisitos nao funcionais)**
- Listagem de prestadores deve ser armazenada em CACHE (as much as possible);

**RN(regras de negocio)**
- Cada agendamento max 1h;
- Agendamento disponiveis das 8h as 18h (utimo agendamento as 17h);
- Usuario nao pode agendar horario booked;
- Usuario nao pode agendar horario que ja passou;
- Usuario nao pode agendar horario com ele mesmo;



# -------MICRO--------



