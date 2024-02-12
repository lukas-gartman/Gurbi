
export interface Permission {
    permissionName : string;
  }
  

export interface Role{
    roleName : string
    permission : Permission[]
}


export interface NewOrganisationDTO{
    creatorNickName : string;
    orgName : string;
    roles : Role[];
}

export interface NewOrganisation extends NewOrganisationDTO{
    creatorId : string
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
