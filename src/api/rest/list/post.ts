import Axios, { imagesConditon } from 'api/rest/axios';
import { ID, IQueryPost } from 'models/common';
import { IEmotionList, IModePost, IPost } from 'models/post';
import { IComment } from 'models/comment';

class PostAPI {
    url = `post`

    async create(postInfo: Partial<IPost>) {
        let form = new FormData()
        form.append('content', postInfo.content || '')
        form.append('mode', postInfo.mode || 'public')
        if (postInfo.images) {
            for (const image of postInfo.images) form.append('images', image)
        }

        return Axios.post(`${this.url}/create`, form, imagesConditon)
    }
    async update(postInfo: Partial<IPost>) {
        let form = new FormData()
        form.append('content', postInfo.content as string)
        form.append('mode', postInfo.mode as IModePost)
        if (postInfo.images) {
            for (const image of postInfo.images) form.append('images', image)
        }

        return Axios.put(`${this.url}/update/${postInfo._id}`, form, imagesConditon)
    }

    async updateEmotion(postId: ID,updateType:IEmotionList) {
        return Axios.put<IEmotionList>(`${this.url}/updateEmotion/${postId}/${updateType}`)
    }

    async addComment(commentInfo: Partial<IComment>, postId: string) {
        let form = new FormData()
        form.append('content', commentInfo.content || '')
        if (commentInfo.images) {
            for (const image of commentInfo.images) form.append('images', image)
        }

        return Axios.put(`${this.url}/addComment/${postId}`, form, imagesConditon)
    }

    async getFromAllUser(query?: IQueryPost) {
        return Axios.get<IPost[]>(`${this.url}/getAllUser`)
    }
    async getFromOneUser(query?: IQueryPost) {
        return Axios.get<IPost[]>(`${this.url}/getOneUser`)
    }
    async acceptInvite(friendId: string) {
        return Axios.post(`${this.url}/acceptInvite`, { friendId })
    }
}

export const postAPI = new PostAPI()
