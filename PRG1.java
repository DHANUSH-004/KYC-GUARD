import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeParseException;
import java.util.Scanner;

public class PRG1 {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);


        System.out.print("Enter access password: ");
        String password = sc.nextLine();
        if (!password.equals("KYC123")) {
            System.out.println("Access Denied!");
            sc.close();
            return;
        }

        try {
            KycProfile profile = new KycProfile();

            System.out.print("Enter name: ");
            profile.setName(sc.nextLine());

            System.out.print("Enter DOB (YYYY-MM-DD): ");
            profile.setDob(sc.nextLine());

            System.out.print("Enter Aadhaar number: ");
            profile.setAadhaarNumber(sc.nextLine());

            System.out.print("Enter PAN number: ");
            profile.setPanNumber(sc.nextLine());

            int age = checkAge(profile);

            System.out.println("\nKYC Verification Successful!");
            System.out.println("Name   : " + profile.getName().toUpperCase());
            System.out.println("Age    : " + age);
            System.out.println("Aadhaar: XXXX-XXXX-" + profile.getAadhaarNumber().substring(8));
            System.out.println("PAN    : " + profile.getPanNumber());

        } catch (InvalidIdentityDocumentException | UnderageApplicantException e) {
            System.out.println("Verification Failed: " + e.getMessage());
        } finally {
            sc.close();
        }
    }


    static int checkAge(KycProfile profile) throws UnderageApplicantException {
        int age = Period.between(profile.getDob(), LocalDate.now()).getYears();
        if (age < 18) {
            throw new UnderageApplicantException(
                    "Applicant is " + age + " years old. Parent/guardian required.");
        }
        return age;
    }
}


class InvalidIdentityDocumentException extends Exception {
    InvalidIdentityDocumentException(String msg) {
        super(msg);
    }
}

class UnderageApplicantException extends Exception {
    UnderageApplicantException(String msg) {
        super(msg);
    }
}


class KycProfile {
    private String name;
    private LocalDate dob;
    private String aadhaarNumber;
    private String panNumber;


    String getName()          { return name; }
    LocalDate getDob()        { return dob; }
    String getAadhaarNumber() { return aadhaarNumber; }
    String getPanNumber()     { return panNumber; }


    void setName(String name) throws InvalidIdentityDocumentException {
        name = name.trim();
        if (!name.matches("[A-Za-z ]+")) {
            throw new InvalidIdentityDocumentException("Name must contain only letters and spaces.");
        }
        this.name = name;
    }

    void setDob(String dob) throws InvalidIdentityDocumentException {
        try {
            LocalDate date = LocalDate.parse(dob.trim());
            if (date.isAfter(LocalDate.now())) {
                throw new InvalidIdentityDocumentException("Date of birth cannot be in the future.");
            }
            this.dob = date;
        } catch (DateTimeParseException e) {
            throw new InvalidIdentityDocumentException("Invalid DOB format. Use YYYY-MM-DD.");
        }
    }

    void setAadhaarNumber(String aadhaar) throws InvalidIdentityDocumentException {
        aadhaar = aadhaar.replaceAll("[ -]", "");      // allow 1234 5678 9012
        if (!aadhaar.matches("[0-9]{12}")) {
            throw new InvalidIdentityDocumentException("Aadhaar must contain exactly 12 digits.");
        }
        this.aadhaarNumber = aadhaar;
    }

    void setPanNumber(String pan) throws InvalidIdentityDocumentException {
        pan = pan.trim().toUpperCase();
        if (pan.length() != 10) {
            throw new InvalidIdentityDocumentException("PAN must be 10 characters.");
        }
        if (!pan.matches("[A-Z]{5}[0-9]{4}[A-Z]")) {
            throw new InvalidIdentityDocumentException("PAN must be 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F).");
        }
        this.panNumber = pan;
    }
}
