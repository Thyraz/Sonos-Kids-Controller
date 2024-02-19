import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    async setString(key: string, value: string) {
        await Storage.set({ key, value });
    }

    async getString(key: string): Promise<{ value: any }> {
        return (await Storage.get({ key }));
    }

    async setObject(key: string, value: any) {
        await Storage.set({ key, value: JSON.stringify(value) });
    }

    async getObject(key: string): Promise<{ value: any }> {
        const ret = await Storage.get({ key });
        return JSON.parse(ret.value);
    }

    async removeItem(key: string) {
        await Storage.remove({ key });
    }

    async clear() {
        await Storage.clear();
    }

    async keys() {
        return Storage.keys;
    }

    async isKey(key: string): Promise<boolean> {

        let exists: boolean = false;
		await Storage.get({ key }).then(data=> {
			if(data.value != null) {
                exists = true;
            }
        })
 
        return exists;
    }
}