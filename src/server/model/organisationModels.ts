
export interface Permission {
    permissionName : string;
  }
  

export interface Role{
    roleName : string
    permissions : Permission[]
}

export interface Member{
    userId : string;
    role : Role;
    nickName : string;
}

export interface Organisation{

     organisationMembers : Member[];
     organisationRoles : Role[];
     organisationName : string;
     organisationId : string;

}


//convince
export interface NewOrganisationDTO{
    creatorNickName : string;
    orgName : string;
    roles : Role[];
}
export interface NewOrganisationData extends NewOrganisationDTO{
    creatorId : string
}