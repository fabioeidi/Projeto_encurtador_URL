import { Request, response, Response } from "express";
import shortId from "shortid";
import {config} from "../config/Constants";
import { URLModel } from "../database/model/URL";

export class URLController {
  public async shorten(req: Request, res: Response): Promise<void> {
    // ver se a URL já não existe
    const {originURL} = req.body
    const url = await URLModel.findOne({originURL})
    if (url){
      response.json(url)
      return
    }

    // criar a hash para esse URL
    const hash = shortId.generate()
    const shortURL = `${config.API_URL}/${hash}`

    // salvar a URL no banco
    const newURL = await URLModel.create({hash, shortURL, originURL})
    response.json(newURL)

    // retornar a URL que a gente salvou
    res.json({originURL, hash, shortURL})
  }


  public async redirect(req: Request, res: Response): Promise<void> {
    // Pegar a hash da URL
    const { hash } = req.params
    const url = URLModel.findOne({hash})

    if(url) {
      res.redirect(url.originURL)
      return
    }
    res.status(400).json({error: 'URL not Found'})
  }
}