from PIL import Image
import os

def redimensionner_images(dossier_source, dossier_destination, nouvelle_taille):
    
    if not os.path.exists(dossier_destination):
        os.makedirs(dossier_destination)
    
    extensions = ('.png', '.jpg', '.jpeg', '.bmp', '.gif')
    
    for fichier in os.listdir(dossier_source):
        if fichier.lower().endswith(extensions):
            chemin_image = os.path.join(dossier_source, fichier)
            
            with Image.open(chemin_image) as img:
                img_redimensionnee = img.resize(nouvelle_taille, Image.Resampling.LANCZOS)
                
                chemin_destination = os.path.join(dossier_destination, fichier)
            
                img_redimensionnee.save(chemin_destination)

if __name__ == "__main__":

    redimensionner_images("C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_1/bonus", "C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_2/bonus", (326, 326))
    redimensionner_images("C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_1/decor", "C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_2/decor", (326, 326))
    redimensionner_images("C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_1/enemies", "C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_2/enemies", (326, 326))
    redimensionner_images("C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_1/player", "C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_2/player", (326, 326))

    redimensionner_images("C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_1/bonus", "C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_3/bonus", (196, 196))
    redimensionner_images("C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_1/decor", "C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_3/decor", (196, 196))
    redimensionner_images("C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_1/enemies", "C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_3/enemies", (196, 196))
    redimensionner_images("C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_1/player", "C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_3/player", (196, 196))
    redimensionner_images("C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_1/bonus", "C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_4/bonus", (68, 68))
    redimensionner_images("C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_1/enemies", "C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_4/enemies", (68))
    redimensionner_images("C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_1/decor", "C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_4/decor", (68, 68, 68))
    redimensionner_images("C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_1/player", "C:/Users/giszc/OneDrive/Bureau/code/NPM/eat them all/assets/textures/scale_4/player", (68, 68))

    
    print("\nTraitement terminé !")