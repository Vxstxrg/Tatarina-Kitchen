"use server"
import {IFormData} from "../types/form-data";
import {prisma} from "@/utils/prisma";
import {saltAndHashPassword} from "@/utils/password";

export async function registerUser(formData: IFormData) {
	const {email, password, confirmPassword} =formData;

if (password !== confirmPassword) {
	return {error:"Пароли не совпадают"};
}

if(password.length < 6){
return {error:"Парль должен быть длинной не менее6 символов"}

}
try {
	const existingUser = await prisma.user.findUnique({where: {email}});
	if (existingUser) {
		return {error:"Пользователь с таким Email уже существует"};
	}
	const pwHash = await saltAndHashPassword(password);
	
	const user = await prisma.user.create({
		data: {
			email: email,
			password: pwHash,
		},
	});

	console.log("user", user);

	return user
	} catch (error) {
		console.error("Error creating user:", error);
		return { error: "Error creating user" };
	}


	
}