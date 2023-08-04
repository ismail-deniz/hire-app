package com.isoobss.project.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.isoobss.project.dto.ApplicationDTO;
import com.isoobss.project.enums.ApplicationStatus;
import com.isoobss.project.model.Applicant;
import com.isoobss.project.model.Application;
import com.isoobss.project.model.Opening;
import com.isoobss.project.repository.ApplicantRepository;
import com.isoobss.project.repository.ApplicationRepository;
import com.isoobss.project.repository.OpeningRepository;
import com.isoobss.project.request.ApplicationRequest;

@Service
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final OpeningRepository openingRepository;
    private final ApplicantRepository applicantRepository;

    @Autowired
    public ApplicationService(ApplicationRepository applicationRepository, 
                                OpeningRepository openingRepository,
                                ApplicantRepository applicantRepository) {
        this.applicationRepository = applicationRepository;
        this.openingRepository = openingRepository;
        this.applicantRepository = applicantRepository;
    }

    public List<ApplicationDTO> getAllApplicationsByApplicantId(String applicantId) {
        return applicationRepository.findByApplicantId(new ObjectId(applicantId)).stream().map(application -> convertToDto(application)).toList();
    }

    public Application applyToOpening(ApplicationRequest req) {
        Application application = new Application();
        application.setApplicantId(new ObjectId(req.getApplicantId()));
        application.setOpeningId(new ObjectId(req.getOpeningId()));
        application.setStatus(ApplicationStatus.valueOf(req.getStatus()));
        application.setCoverLetter(req.getCoverLetter());

        Applicant applicant = applicantRepository.findById(application.getApplicantId()).get();
        if (applicant == null) {
            return null;
        }
        if (applicant.getAppliedOpeningIds() == null) {
            applicant.setAppliedOpeningIds(new ArrayList<ObjectId>());
        }
        applicant.getAppliedOpeningIds().add(application.getOpeningId());
        applicantRepository.save(applicant);

        return applicationRepository.save(application);
    }
    
    public ApplicationDTO acceptApplicant(String openingId, String applicantId) {
        Application application = applicationRepository.findByOpeningIdAndApplicantId(new ObjectId(openingId), new ObjectId(applicantId));
        if (application == null) {
            return null;
        }
        application.setStatus(ApplicationStatus.ACCEPTED);
        Opening opening = openingRepository.findById(application.getOpeningId()).get();
        String recepientEmail = applicantRepository.findById(application.getApplicantId()).get().getEmail();
        String subject = "Job Application Status - OBSS";
        String body = """
                Dear Applicant,
                Your application for the job opening: """
                + " " + opening.getTitle() + " " +
                        """ 
                has been accepted.
                Please contact the HR department for further information.
                """;

        new Thread(() -> sendEmail(recepientEmail, subject, body)).start();

        return convertToDto(applicationRepository.save(application));
    }

    public ApplicationDTO declineApplicant(String openingId, String applicantId) {
        Application application = applicationRepository.findByOpeningIdAndApplicantId(new ObjectId(openingId), new ObjectId(applicantId));
        if (application == null) {
            return null;
        }
        application.setStatus(ApplicationStatus.DENIED);

        Opening opening = openingRepository.findById(application.getOpeningId()).get();
        String recepientEmail = applicantRepository.findById(application.getApplicantId()).get().getEmail();
        String subject = "Job Application Status - OBSS";
        String body = """
                Dear Applicant,
                Your application for the job opening: """
                + " " + opening.getTitle() + " " +
                        """ 
                has been declined.
                Please contact the HR department for further information.
                """;

        new Thread(() -> sendEmail(recepientEmail, subject, body)).start();
        return convertToDto(applicationRepository.save(application));
    }

    public ApplicationDTO processApplicant(String openingId, String applicantId) {
        Application application = applicationRepository.findByOpeningIdAndApplicantId(new ObjectId(openingId), new ObjectId(applicantId));
        if (application == null) {
            return null;
        }
        application.setStatus(ApplicationStatus.IN_PROCESS);

        Opening opening = openingRepository.findById(application.getOpeningId()).get();
        String recepientEmail = applicantRepository.findById(application.getApplicantId()).get().getEmail();
        String subject = "Job Application Status - OBSS";
        String body = """
                Dear Applicant,
                Your application for the job opening: """
                + " " + opening.getTitle() + " " +
                        """ 
                has been reviewed.
                Please contact the HR department for further information.
                """;
                

        new Thread(() -> sendEmail(recepientEmail, subject, body)).start();
        return convertToDto(applicationRepository.save(application));
    }

    public ApplicationDTO getApplication(String openingId, String applicantId) {
        Application application = applicationRepository.findByOpeningIdAndApplicantId(new ObjectId(openingId), new ObjectId(applicantId));
        if (application == null) {
            return null;
        }
        return convertToDto(application);
    }



    private ApplicationDTO convertToDto(Application application) {
        Opening opening = openingRepository.findById(application.getOpeningId()).get();
        if (opening == null) {
            return null;
        }
        ApplicationDTO applicationDTO = new ApplicationDTO();
        applicationDTO.setId(application.getId().toString());
        applicationDTO.setApplicantId(application.getApplicantId().toString());
        applicationDTO.setOpeningId(application.getOpeningId().toString());
        applicationDTO.setStatus(application.getStatus());
        applicationDTO.setCoverLetter(application.getCoverLetter());
        applicationDTO.setOpeningTitle(opening.getTitle());
        applicationDTO.setOpeningIsActive(opening.isActive());

        return applicationDTO;
    }

    private void sendEmail(String recipientEmail, String subject, String text) {
        // Outlook.com configuration
        String host = "smtp.office365.com";
        String port = "587";
        String username = "isoobss@outlook.com";
        String password = "obssiso.";
        
        String body = text;

        try {
            // Setup mail server properties
            Properties properties = new Properties();
            properties.put("mail.smtp.host", host);
            properties.put("mail.smtp.port", port);
            properties.put("mail.smtp.auth", "true");
            properties.put("mail.smtp.starttls.enable", "true");

            // Create a session with authentication
            Session session = Session.getInstance(properties);
            MimeMessage message = new MimeMessage(session);

            // Set the sender and recipient addresses
            message.setFrom(new InternetAddress(username));
            message.setRecipient(Message.RecipientType.TO, new InternetAddress(recipientEmail));

            // Set the email subject and body
            message.setSubject(subject);
            message.setText(body);

            // Send the email
            Transport transport = session.getTransport("smtp");
            transport.connect(host, username, password);
            transport.sendMessage(message, message.getAllRecipients());
            transport.close();

            System.out.println("Email sent successfully!");
            } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
