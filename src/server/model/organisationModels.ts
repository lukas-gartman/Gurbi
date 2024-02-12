
export interface Permission {
    permissionName : string;
  }
  

export interface Role{
    roleName : string
    permissions : Permission[]
}

export interface Member{
    memberId : string;
    role : Role;
    nickName : string;
}

export interface Organisation{

     members : Member[];
     roles : Role[];
     organisationName : string;
     id : string;

}

export interface NewOrganisationDTO{
    creatorNickName : string;
    orgName : string;
    roles : Role[];
}

export interface NewOrganisationData extends NewOrganisationDTO{
    creatorId : string
}