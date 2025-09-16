
const Roles = Object.freeze({
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "moderator",

});


const ContentTypes = Object.freeze({
  VIDEO: "video",
});


const CollectionNames = Object.freeze({

  USERS: "users",
  LIKE:"likes",
  MATCHES:"matches"
  
  
});


const DocumentType = Object.freeze({
  LICENSE: "license",
  ID_FRONT: "id_front",
  ID_BACK: "id_back",
  CONTRACT: "contract",
});

export { Roles, ContentTypes, CollectionNames, DocumentType };
