package au.edu.rmit.sept.webapp.service;

import org.imgscalr.Scalr;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@Service
public class ImageService {

    private static final int MAX_WIDTH = 500; // Maximum width for the image
    private static final int MAX_HEIGHT = 500; // Maximum height for the image

    // Method to validate and resize image
    public String processImage(MultipartFile file) throws IOException {
        
        String fileExtension = getFileExtension(file);
        if (!isSupportedFileType(fileExtension)) {
            throw new IOException("Unsupported file type: " + fileExtension);
        }
        // Read the image file into a BufferedImage
        BufferedImage image = ImageIO.read(file.getInputStream());

        // Validate the dimensions
        if (image.getWidth() > MAX_WIDTH || image.getHeight() > MAX_HEIGHT) {
            // Resize the image
            image = resizeImage(image);
        }

        // Convert the BufferedImage to a Base64 encoded string
        return encodeToBase64(image, getFileExtension(file));
    }

    private boolean isSupportedFileType(String fileExtension) {
        return "jpg".equalsIgnoreCase(fileExtension) || "png".equalsIgnoreCase(fileExtension);
    }

    // Method to resize the image
    private BufferedImage resizeImage(BufferedImage originalImage) {
        return Scalr.resize(originalImage, Scalr.Method.QUALITY, Scalr.Mode.AUTOMATIC, MAX_WIDTH, MAX_HEIGHT);
    }

    // Method to encode image to Base64
    private String encodeToBase64(BufferedImage image, String extension) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(image, extension, outputStream);
        return Base64.getEncoder().encodeToString(outputStream.toByteArray());
    }

    // Helper method to get the file extension
    private String getFileExtension(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }
}
