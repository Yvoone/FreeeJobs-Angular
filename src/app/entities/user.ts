export class User {

    id: number;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    contactNo: string;
    gender: string;
    dob: string;
    aboutMe: string;
    skills: string;
    linkedInAcct: string;
    professionalTitle: string;

    constructor(id: number, password: string, firstName: string, lastName: string, email: string,contactNo: string, gender: string, dob: string,
        aboutMe: string, skills: string, linkedInAcct: string, professionalTitle: string) {
        this.id = id;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.contactNo = contactNo;
        this.gender = gender;
        this.dob = dob;
        this.aboutMe = aboutMe;
        this.skills = skills;
        this.linkedInAcct = linkedInAcct;
        this.professionalTitle = professionalTitle;
    }
}
