package com.isoobss.project.service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.isoobss.project.exception.UserNotFoundException;
import com.isoobss.project.model.Applicant;
import com.isoobss.project.model.Certificaiton;
import com.isoobss.project.model.Education;
import com.isoobss.project.model.Experience;
import com.isoobss.project.repository.ApplicantRepository;

@Service
public class ScrapeService {
    private final ApplicantRepository applicantRepository;

    @Autowired
    public ScrapeService(ApplicantRepository applicantRepository) {
        this.applicantRepository = applicantRepository;
    }

    public Applicant scrapeProfile(String profileUrl, String email) throws UserNotFoundException{
        Applicant applicant = applicantRepository.findByEmail(email);
        if (applicant == null){
            throw new UserNotFoundException("email: " + email + " cannot be found!");
        }

        System.setProperty("webdriver.chrome.driver", "chromedriver.exe");

        // Launch ChromeDriver in incognito mode
        WebDriver driver = new HtmlUnitDriver();

        // Maximize the browser window
        driver.manage().window().maximize();
    
        // Navigate to the user profile page on your website
        //String userProfileUrl = "https://www.linkedin.com/in/aydinmehmetemin/";
        driver.get(profileUrl);

        List<WebElement> liExpElements = null;
        try {
            liExpElements = driver.findElements(By.cssSelector("li.profile-section-card.experience-item"));
            applicant.setExperienceList(scrapeExperienceSection(liExpElements));
        } catch (NoSuchElementException e) {
            // Handle if the title element is not found (Optional: You can log or do other actions here)
        }

        List<WebElement> liExpGroupElements = null;
        try {
            liExpGroupElements = driver.findElements(By.cssSelector("li.experience-group.experience-item"));
            applicant.getExperienceList().addAll(scrapeExperienceGroupSection(liExpGroupElements));
        } catch (NoSuchElementException e) {
            // Handle if the title element is not found (Optional: You can log or do other actions here)
        }

        // Find all <li> elements with class "profile-section-card" and "education__list-item"
        List<WebElement> liEduElements = null;
        try {
            liEduElements = driver.findElements(By.cssSelector("li.profile-section-card.education__list-item"));
            applicant.setEducationList(scrapeEducationSection(liEduElements));
        } catch (NoSuchElementException e) {
            // handle
        }

        WebElement ulCertificationListElement = null;
        List<WebElement> liCertificationElements = null;
        try {
            ulCertificationListElement = driver.findElement(By.cssSelector("ul.certifications__list"));
            liCertificationElements = ulCertificationListElement.findElements(By.cssSelector("li.profile-section-card "));
            applicant.setCertificateList(scrapeCertificationsSection(liCertificationElements));
        } catch (NoSuchElementException e) {
            // handle exception
        }

        // Get the page source
        String pageSource = driver.getPageSource();

        // Write the page source to a file
        String fileName = "page_source.html";
        try {
            File file = new File(fileName);
            FileWriter fileWriter = new FileWriter(file);
            BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
            bufferedWriter.write(pageSource);
            bufferedWriter.close();
            System.out.println("Page source written to: " + fileName);
        } catch (IOException e) {
            e.printStackTrace();
        }

        driver.quit();
        
        // update applicant
        applicantRepository.save(applicant);
        return applicant;
    }

    
    private List<Experience> scrapeExperienceSection(List<WebElement> liExpElements) {
        List<Experience> expList = new ArrayList<Experience>();
        // Loop through each <li> element and extract the title and subtitle
        for (WebElement liExpElement : liExpElements) {
            // Extract the title (Summer Intern, Crew Member, etc.)
            String title = "";
            try {
                title = liExpElement.findElement(By.cssSelector("h3.profile-section-card__title")).getAttribute("innerText");
            } catch (NoSuchElementException e) {
                // Handle if the title element is not found (Optional: You can log or do other actions here)
            }
            
            // Extract the subtitle (OBSS, Nom Nom Nom, Aselsan, etc.)
            String subtitle = "";
            try {
                subtitle = liExpElement.findElement(By.cssSelector("h4.profile-section-card__subtitle a")).getAttribute("innerText");
            } catch (NoSuchElementException e) {
                // Handle if the subtitle element is not found (Optional: You can log or do other actions here)
            }
            
            // Extract the description
            String description = "";
            try {
                description = liExpElement.findElement(By.cssSelector("div.experience-item__description .show-more-less-text__text--less")).getAttribute("innerText");
            } catch (NoSuchElementException e) {
                // Handle if the description element is not found (Optional: You can log or do other actions here)
            }
            
            // Extract the time span
            String timeSpan = "";
            try {
                timeSpan = liExpElement.findElement(By.cssSelector("p.experience-item__duration")).getText();
            } catch (NoSuchElementException e) {
                // Handle if the time span element is not found (Optional: You can log or do other actions here)
            }
            Experience exp = new Experience();
            exp.setTitle(title.trim());
            exp.setEmployer(subtitle);
            exp.setDateInfo(timeSpan);
            exp.setDescription(description);
            expList.add(exp);
        }

        return expList;
    }

    private List<Experience> scrapeExperienceGroupSection(List<WebElement> liExpGroupElements) {
        List<Experience> expList = new ArrayList<Experience>();
        for (WebElement liExpGroupElement : liExpGroupElements) { 
            List<WebElement> positionElements = null;
            try {
                positionElements = liExpGroupElement.findElements(By.cssSelector("li.profile-section-card.experience-group-position"));
            } catch (NoSuchElementException e) {
                // handle exception
            }

            for (WebElement positionElement: positionElements) {
                // Extract the title (Summer Intern, Crew Member, etc.)
                String title = "";
                try {
                    title = positionElement.findElement(By.cssSelector("h3.profile-section-card__title")).getAttribute("innerText");
                } catch (NoSuchElementException e) {
                    // Handle if the title element is not found (Optional: You can log or do other actions here)
                }
            
                // Extract the subtitle (OBSS, Nom Nom Nom, Aselsan, etc.)
                String subtitle = "";
                try {
                    subtitle = positionElement.findElement(By.cssSelector("h4.profile-section-card__subtitle a")).getAttribute("innerText");
                } catch (NoSuchElementException e) {
                    // Handle if the subtitle element is not found (Optional: You can log or do other actions here)
                }
            
                // Extract the description
                String description = "";
                try {
                    description = positionElement.findElement(By.cssSelector("div.experience-group-position__description")).getAttribute("innerText");
                } catch (NoSuchElementException e) {
                    // Handle if the description element is not found (Optional: You can log or do other actions here)
                }
            
                // Extract the time span
                String timeSpan = "";
                try {
                    timeSpan = positionElement.findElement(By.cssSelector("p.experience-group-position__duration")).getText();
                } catch (NoSuchElementException e) {
                    // Handle if the time span element is not found (Optional: You can log or do other actions here)
                }
            
                Experience exp = new Experience();
                exp.setTitle(title.trim());
                exp.setEmployer(subtitle);
                exp.setDateInfo(timeSpan);
                exp.setDescription(description);
                expList.add(exp);
            }
        }

        return expList;
    }

    private List<Education> scrapeEducationSection(List<WebElement> liEduElements) {
        List<Education> eduList = new ArrayList<Education>();
         // Loop through each <li> element and extract the title, subtitle, and time span
        for (WebElement liEduElement : liEduElements) {
            String title = "";
            try {
                title = liEduElement.findElement(By.cssSelector("h3.profile-section-card__title")).getAttribute("innerText");
            } catch (NoSuchElementException e) {
                // Handle if the title element is not found (Optional: You can log or do other actions here)
            }
        
            // Extract the subtitle (OBSS, Nom Nom Nom, Aselsan, etc.)
            String subtitle = "";
            try {
                subtitle = liEduElement.findElement(By.cssSelector("h4.profile-section-card__subtitle")).getText();
            } catch (NoSuchElementException e) {
                // Handle if the subtitle element is not found (Optional: You can log or do other actions here)
            }
            // Extract the time span
            String timeSpan = "";
            try {
                timeSpan = liEduElement.findElement(By.cssSelector("p.education__item.education__item--duration")).getText();
            } catch (NoSuchElementException e) {
                // Handle if the time span element is not found (Optional: You can log or do other actions here)
            }

            Education edu = new Education();
            edu.setInstitution(title.trim());
            edu.setDescription(subtitle);
            edu.setDateInfo(timeSpan);
            eduList.add(edu);
        }

        return eduList;
    }
    
    private List<Certificaiton> scrapeCertificationsSection(List<WebElement> liCertificationElements) {
        List<Certificaiton> certList = new ArrayList<Certificaiton>();

        for (WebElement liCertificationElement : liCertificationElements) {
             String title = "";
            try {
                title = liCertificationElement.findElement(By.cssSelector("h3.profile-section-card__title")).getAttribute("innerText");
            } catch (NoSuchElementException e) {
                // Handle if the title element is not found (Optional: You can log or do other actions here)
            }
        
            // Extract the subtitle (OBSS, Nom Nom Nom, Aselsan, etc.)
            String subtitle = "";
            try {
                subtitle = liCertificationElement.findElement(By.cssSelector("h4.profile-section-card__subtitle")).getText();
            } catch (NoSuchElementException e) {
                // Handle if the subtitle element is not found (Optional: You can log or do other actions here)
            }

            String date = "";
            try {
                date = liCertificationElement.findElement(By.cssSelector("div.certifications__date-range")).getAttribute("innerText");
            } catch (NoSuchElementException e) {
                // Handle if the time span element is not found (Optional: You can log or do other actions here)
            }

            String credentialId = "";
            try {
                credentialId = liCertificationElement.findElement(By.cssSelector("div.certifications__credential-id")).getAttribute("innerText");
            } catch (NoSuchElementException e) {
                // Handle if the time span element is not found (Optional: You can log or do other actions here)
            }

            Certificaiton cert = new Certificaiton();
            cert.setTitle(title.trim());
            cert.setInstitution(subtitle);
            cert.setDateInfo(date);
            cert.setCredentialInfo(credentialId);
            certList.add(cert);
        }
        
        return certList;
    }
    
}




/*
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

public class ScrapeService {

    public static void main(String[] args) {
        // Set the path to ChromeDriver executable
        //System.setProperty("webdriver.chrome.driver", "chromedriver.exe");

        // Create a new instance of ChromeDriver
        WebDriver driver = new HtmlUnitDriver();

        driver.get("https://www.linkedin.com/login");

        // Find and enter your email/phone
        WebElement emailInput = driver.findElement(By.id("username"));
        emailInput.sendKeys("dertbagrimda@gmail.com");

        // Find and enter your password
        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.sendKeys("yokyarinlar");

        // Find and click the "Sign in" button to submit the login form
        WebElement signInButton = driver.findElement(By.xpath("//button[@type='submit']"));
        signInButton.click();

        // // Navigate to the user profile page on your website
        // String userProfileUrl = "https://tr.linkedin.com/in/ismail-deniz";
        // driver.get(userProfileUrl);

        // // Find the dropdown menu element that contains the "PDF olarak kaydet" choice
        // WebElement dropdownMenu = driver.findElement(By.className("pvs-overflow-actions-dropdown__content"));

        // // Find the "PDF olarak kaydet" element and click it
        // WebElement pdfElement = dropdownMenu.findElement(By.xpath("//span[contains(text(), 'PDF olarak kaydet')]"));
        // pdfElement.click();


        // Find all <li> elements with class "profile-section-card" and "experience-item"
        List<WebElement> liExpElements = driver.findElements(By.cssSelector("li.profile-section-card.experience-item"));

        // Loop through each <li> element and extract the title and subtitle
        for (WebElement liExpElement : liExpElements) {
            // Extract the title (Summer Intern, Crew Member, etc.)
            String title = liExpElement.findElement(By.cssSelector("h3.profile-section-card__title")).getAttribute("innerText");

            // Extract the subtitle (OBSS, Nom Nom Nom, Aselsan, etc.)
            String subtitle = liExpElement.findElement(By.cssSelector("h4.profile-section-card__subtitle a")).getAttribute("innerText");

            // Extract the description
            String description = liExpElement.findElement(By.cssSelector("div.experience-item__description .show-more-less-text__text--less")).getAttribute("innerText");

            // Extract the time span
            String timeSpan = liExpElement.findElement(By.cssSelector("span.date-range time")).getAttribute("innerText");

            System.out.println("Title: " + title.trim());
            System.out.println("Subtitle: " + subtitle.trim());
            System.out.println("Description: " + description.trim());
            System.out.println("Time Span: " + timeSpan.trim());
            System.out.println("----------------------");
        }

        // Find all <li> elements with class "profile-section-card" and "education__list-item"
        List<WebElement> liEduElements = driver.findElements(By.cssSelector("li.profile-section-card.education__list-item"));

        // Loop through each <li> element and extract the title, subtitle, and time span
        for (WebElement liEduElement : liEduElements) {
            // Extract the title (Bilkent Üniversitesi, Vrije Universiteit Amsterdam, etc.)
            String title = liEduElement.findElement(By.cssSelector("h3.profile-section-card__title a")).getAttribute("innerText");

            // Extract the subtitle (Bachelor's degree in Computer Engineering, Exchange Student in Computer Science, etc.)
            String subtitle = liEduElement.findElement(By.cssSelector("h4.profile-section-card__subtitle")).getAttribute("innerText");

            // Extract the time span (2019 - 2024, 2022 - 2023, etc.)
            String timeSpan = liEduElement.findElement(By.cssSelector("span.date-range")).getAttribute("innerText");

            System.out.println("Title: " + title.trim());
            System.out.println("Subtitle: " + subtitle.trim());
            System.out.println("Time Span: " + timeSpan.trim());
            System.out.println("----------------------");
        }

        // Close the WebDriver
        driver.quit();
    }
}


// Check if the "experience" element is inside an iframe
        WebElement experienceFrame = null;
        try {
            experienceFrame = driver.findElement(By.xpath("//iframe[@title='Experience']"));
        } catch (org.openqa.selenium.NoSuchElementException e) {
            // If the iframe is not found, it means the element is not inside an iframe
        }

        if (experienceFrame != null) {
            // Switch to the iframe
            driver.switchTo().frame(experienceFrame);
        }

        // Now you can locate the "experience" element and perform scraping as needed
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement experienceAnchor = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("experience")));

        // Traverse to the parent section element
        WebElement experienceSection = experienceAnchor.findElement(By.xpath("./ancestor::section"));

        // Now you have the "Deneyim" section, and you can perform scraping as needed
        scrapeDeneyimSection(experienceSection);

        // If you switched to an iframe, switch back to the main content
        if (experienceFrame != null) {
            driver.switchTo().defaultContent();
        }

        // Close the browser
        driver.quit();
*/

/*
        driver.get("https://www.linkedin.com/login");

        // Find and enter your email/phone
        WebElement emailInput = driver.findElement(By.id("username"));
        emailInput.sendKeys("dertbagrimda@gmail.com");

        // Find and enter your password
        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.sendKeys("yokyarinlar");

        // Find and click the "Sign in" button to submit the login form
        WebElement signInButton = driver.findElement(By.xpath("//button[@type='submit']"));
        signInButton.click();
        */