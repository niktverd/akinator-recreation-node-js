import User from "@/db/User";

class DbUsersEditor {
    constructor() {

    }

    Get = async () => {
        return User.query().select();
    }

    Add = async (login: string, is_doctor = false) => {
        User.query().insert({
            login,
            is_doctor,
        });
    }

    GetById = async (userId: number) => {
        return await User.query().findById(userId);
    }

    // Remove = async (UserId: number) => {
    //     await User.query().delete().where({id: UserId});
    // }

    // UpdateOnDbSide = async (UserId: number, UserText: string) => {
    //     User.query().update({text: UserText}).where({id: UserId});
    // }

}

export default DbUsersEditor;