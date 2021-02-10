import IStorageProvider from "../models/IStorageProver";

class FakeStorageProvider implements IStorageProvider {

  private storageFiles:string[] = [];

  public async saveFile(file: string): Promise<string> {

    this.storageFiles.push(file);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const deleteIndex = this.storageFiles.findIndex(filename=>filename===file);

    if(deleteIndex)
      this.storageFiles.splice(deleteIndex,1);
  }
}

export default FakeStorageProvider;
