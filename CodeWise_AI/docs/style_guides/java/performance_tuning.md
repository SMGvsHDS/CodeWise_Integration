# Java Performance Tuning Guide

> 원문: https://docs.oracle.com/javase/tutorial/essential/environment/

JVM 환경 변수, 시스템 속성, PATH/CLASSPATH 구성, 성능 관련 설정까지 포함한 Oracle 공식 문서의 전체 내용을 병합했습니다.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/environment/


An application runs in aplatform environment, defined by the underlying operating system, the Java virtual machine, the class libraries, and various configuration data supplied when the application is launched. This lesson describes some of the APIs an application uses to examine and configure its platform environment. The lesson consists of three sections:

- Configuration Utilities describes APIs used to access configuration data supplied when the application is deployed, or by the application's user.
- System Utilities describes miscellaneous APIs defined in the System and Runtime classes.
- PATH and CLASSPATH describes environment variables used to configure JDK development tools and other applications.

---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/environment/config.html


This section describes some of the configuration utilities that help an application access its startup context.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/environment/properties.html


Properties are configuration values managed askey/value pairs. In each pair, the key and value are bothStringvalues. The key identifies, and is used to retrieve, the value, much as a variable name is used to retrieve the variable's value. For example, an application capable of downloading files might use a property named "download.lastDirectory" to keep track of the directory used for the last download.


To manage properties, create instances ofjava.util.Properties. This class provides methods for the following:

- loading key/value pairs into a Properties object from a stream,
- retrieving a value from its key,
- listing the keys and their values,
- enumerating over the keys, and
- saving the properties to a stream.

For an introduction to streams, refer to the sectionI/O Streamsin theBasic I/Olesson.


Propertiesextendsjava.util.Hashtable. Some of the methods inherited fromHashtablesupport the following actions:

- testing to see if a particular key or value is in the Properties object,
- getting the current number of key/value pairs,
- removing a key and its value,
- adding a key/value pair to the Properties list,
- enumerating over the values or the keys,
- retrieving a value by its key, and
- finding out if the Properties object is empty.

TheSystemclass maintains aPropertiesobject that defines the configuration of the current working environment. For more about these properties, seeSystem Properties. The remainder of this section explains how to use properties to manage application configuration.


## Properties in the Application Life Cycle


The following figure illustrates how a typical application might manage its configuration data with aPropertiesobject over the course of its execution.

- Starting Up The actions given in the first three boxes occur when the application is starting up. First, the application loads the default properties from a well-known location into a Properties object. Normally, the default properties are stored in a file on disk along with the .class and other resource files for the application. Next, the application creates another Properties object and loads the properties that were saved from the last time the application was run. Many applications store properties on a per-user basis, so the properties loaded in this step are usually in a specific file in a particular directory maintained by this application in the user's home directory. Finally, the application uses the default and remembered properties to initialize itself. The key here is consistency. The application must always load and save properties to the same location so that it can find them the next time it's executed.
- Running During the execution of the application, the user may change some settings, perhaps in a Preferences window, and the Properties object is updated to reflect these changes. If the users changes are to be remembered in future sessions, they must be saved.
- Exiting Upon exiting, the application saves the properties to its well-known location, to be loaded again when the application is next started up.

## Setting Up the Properties Object


The following Java code performs the first two steps described in the previous section: loading the default properties and loading the remembered properties:


```java
. . .
// create and load default properties
Properties defaultProps = new Properties();
FileInputStream in = new FileInputStream("defaultProperties");
defaultProps.load(in);
in.close();

// create application properties with default
Properties applicationProps = new Properties(defaultProps);

// now load properties 
// from last invocation
in = new FileInputStream("appProperties");
applicationProps.load(in);
in.close();
. . .
```


First, the application sets up a defaultPropertiesobject. This object contains the set of properties to use if values are not explicitly set elsewhere. Then the load method reads the default values from a file on disk nameddefaultProperties.


Next, the application uses a different constructor to create a secondPropertiesobject,applicationProps, whose default values are contained indefaultProps. The defaults come into play when a property is being retrieved. If the property can't be found inapplicationProps, then its default list is searched.


Finally, the code loads a set of properties intoapplicationPropsfrom a file namedappProperties. The properties in this file are those that were saved from the application the last time it was invoked, as explained in the next section.


## Saving Properties


The following example writes out the application properties from the previous example usingProperties.store. The default properties don't need to be saved each time because they never change.


```java
FileOutputStream out = new FileOutputStream("appProperties");
applicationProps.store(out, "---No Comment---");
out.close();
```


Thestoremethod needs a stream to write to, as well as a string that it uses as a comment at the top of the output.


## Getting Property Information


Once the application has set up itsPropertiesobject, the application can query the object for information about various keys and values that it contains. An application gets information from aPropertiesobject after start up so that it can initialize itself based on choices made by the user. ThePropertiesclass has several methods for getting property information:

- contains(Object value) and containsKey(Object key) Returns true if the value or the key is in the Properties object. Properties inherits these methods from Hashtable . Thus they accept Object arguments, but only String values should be used.
- getProperty(String key) and getProperty(String key, String default) Returns the value for the specified property. The second version provides for a default value. If the key is not found, the default is returned.
- list(PrintStream s) and list(PrintWriter w) Writes all of the properties to the specified stream or writer. This is useful for debugging.
- elements() , keys() , and propertyNames() Returns an Enumeration containing the keys or values (as indicated by the method name) contained in the Properties object. The keys method only returns the keys for the object itself; the propertyNames method returns the keys for default properties as well.
- stringPropertyNames() Like propertyNames , but returns a Set<String> , and only returns names of properties where both key and value are strings. Note that the Set object is not backed by the Properties object, so changes in one do not affect the other.
- size() Returns the current number of key/value pairs.

## Setting Properties


A user's interaction with an application during its execution may impact property settings. These changes should be reflected in thePropertiesobject so that they are saved when the application exits (and calls thestoremethod). The following methods change the properties in aPropertiesobject:

- setProperty(String key, String value) Puts the key/value pair in the Properties object.
- remove(Object key) Removes the key/value pair associated with key.

---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/environment/cmdLineArgs.html


A Java application can accept any number of arguments from the command line. This allows the user to specify configuration information when the application is launched.


The user enters command-line arguments when invoking the application and specifies them after the name of the class to be run. For example, suppose a Java application calledSortsorts lines in a file. To sort the data in a file namedfriends.txt, a user would enter:


```java
java Sort friends.txt
```


When an application is launched, the runtime system passes the command-line arguments to the application's main method via an array ofStrings. In the previous example, the command-line arguments passed to theSortapplication in an array that contains a singleString:"friends.txt".


## Echoing Command-Line Arguments


TheEchoexample displays each of its command-line arguments on a line by itself:


```java
public class Echo {
    public static void main (String[] args) {
        for (String s: args) {
            System.out.println(s);
        }
    }
}
```


The following example shows how a user might runEcho. User input is in italics.


```java
java Echo Drink Hot Java
Drink
Hot
Java
```


Note that the application displays each word —Drink,Hot, andJava— on a line by itself. This is because the space character separates command-line arguments. To haveDrink,Hot, andJavainterpreted as a single argument, the user would join them by enclosing them within quotation marks.


```java
java Echo "Drink Hot Java"
Drink Hot Java
```


## Parsing Numeric Command-Line Arguments


If an application needs to support a numeric command-line argument, it must convert aStringargument that represents a number, such as "34", to a numeric value. Here is a code snippet that converts a command-line argument to anint:


```java
int firstArg;
if (args.length > 0) {
    try {
        firstArg = Integer.parseInt(args[0]);
    } catch (NumberFormatException e) {
        System.err.println("Argument" + args[0] + " must be an integer.");
        System.exit(1);
    }
}
```


parseIntthrows aNumberFormatExceptionif the format ofargs[0]isn't valid. All of theNumberclasses —Integer,Float,Double, and so on — haveparseXXXmethods that convert aStringrepresenting a number to an object of their type.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/environment/env.html


Many operating systems useenvironment variablesto pass configuration information to applications. Like properties in the Java platform, environment variables are key/value pairs, where both the key and the value are strings. The conventions for setting and using environment variables vary between operating systems, and also between command line interpreters. To learn how to pass environment variables to applications on your system, refer to your system documentation.


## Querying Environment Variables


On the Java platform, an application usesSystem.getenvto retrieve environment variable values. Without an argument,getenvreturns a read-only instance ofjava.util.Map, where the map keys are the environment variable names, and the map values are the environment variable values. This is demonstrated in theEnvMapexample:


```java
import java.util.Map;

public class EnvMap {
    public static void main (String[] args) {
        Map<String, String> env = System.getenv();
        for (String envName : env.keySet()) {
            System.out.format("%s=%s%n",
                              envName,
                              env.get(envName));
        }
    }
}
```


With aStringargument,getenvreturns the value of the specified variable. If the variable is not defined,getenvreturnsnull. TheEnvexample usesgetenvthis way to query specific environment variables, specified on the command line:


```java
public class Env {
    public static void main (String[] args) {
        for (String env: args) {
            String value = System.getenv(env);
            if (value != null) {
                System.out.format("%s=%s%n",
                                  env, value);
            } else {
                System.out.format("%s is"
                    + " not assigned.%n", env);
            }
        }
    }
}
```


## Passing Environment Variables to New Processes


When a Java application uses aProcessBuilderobject to create a new process, the default set of environment variables passed to the new process is the same set provided to the application's virtual machine process. The application can change this set usingProcessBuilder.environment.


## Platform Dependency Issues


There are many subtle differences between the way environment variables are implemented on different systems. For example, Windows ignores case in environment variable names, while UNIX does not. The way environment variables are used also varies. For example, Windows provides the user name in an environment variable calledUSERNAME, while UNIX implementations might provide the user name inUSER,LOGNAME, or both.


To maximize portability, never refer to an environment variable when the same value is available in a system property. For example, if the operating system provides a user name, it will always be available in the system propertyuser.name.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/environment/other.html


Here is a summary of some other configuration utilities.


ThePreferences APIallows applications to store and retrieve configuration data in an implementation-dependent backing store. Asynchronous updates are supported, and the same set of preferences can be safely updated by multiple threads and even multiple applications. For more information, refer to thePreferences API Guide.


An application deployed in aJAR archiveuses amanifestto describe the contents of the archive. For more information, refer to thePackaging Programs in JAR Fileslesson.


The configuration of aJava Web Start applicationis contained in aJNLP file. For more information, refer to theJava Web Startlesson.


The configuration of aJava Plug-in appletis partially determined by the HTML tags used to embed the applet in the web page. Depending on the applet and the browser, these tags can include<applet>,<object>,<embed>, and<param>. For more information, refer to theJava Appletslesson.


The classjava.util.ServiceLoaderprovides a simpleservice providerfacility. A service provider is an implementation of aservice— a well-known set of interfaces and (usually abstract) classes. The classes in a service provider typically implement the interfaces and subclass the classes defined in the service. Service providers can be installed as extensions (seeThe Extension Mechanism). Providers can also be made available by adding them to the class path or by some other platform-specific means.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/environment/system.html


TheSystemclass implements a number of system utilities. Some of these have already been covered in the previous section onConfiguration Utilities. This section covers some of the other system utilities.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/environment/cl.html


Systemprovides several predefined I/O objects that are useful in a Java application that is meant to be launched from the command line. These implement the Standard I/O streams provided by most operating systems, and also a console object that is useful for entering passwords. For more information, refer toI/O from the Command Linein theBasic I/Olesson.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/environment/sysprop.html


InProperties, we examined the way an application can usePropertiesobjects to maintain its configuration. The Java platform itself uses aPropertiesobject to maintain its own configuration. TheSystemclass maintains aPropertiesobject that describes the configuration of the current working environment. System properties include information about the current user, the current version of the Java runtime, and the character used to separate components of a file path name.


The following table describes some of the most important system properties


## Reading System Properties


TheSystemclass has two methods used to read system properties:getPropertyandgetProperties.


TheSystemclass has two different versions ofgetProperty. Both retrieve the value of the property named in the argument list. The simpler of the twogetPropertymethods takes a single argument, a property key For example, to get the value ofpath.separator, use the following statement:


```java
System.getProperty("path.separator");
```


ThegetPropertymethod returns a string containing the value of the property. If the property does not exist, this version ofgetPropertyreturns null.


The other version ofgetPropertyrequires twoStringarguments: the first argument is the key to look up and the second argument is a default value to return if the key cannot be found or if it has no value. For example, the following invocation ofgetPropertylooks up theSystemproperty calledsubliminal.message. This is not a valid system property, so instead of returning null, this method returns the default value provided as a second argument: "Buy StayPuft Marshmallows!"


```java
System.getProperty("subliminal.message", "Buy StayPuft Marshmallows!");
```


The last method provided by theSystemclass to access property values is thegetPropertiesmethod, which returns aPropertiesobject. This object contains a complete set of system property definitions.


## Writing System Properties


To modify the existing set of system properties, useSystem.setProperties. This method takes aPropertiesobject that has been initialized to contain the properties to be set. This method replaces the entire set of system properties with the new set represented by thePropertiesobject.


The next example,PropertiesTest, creates aPropertiesobject and initializes it frommyProperties.txt.


```java
subliminal.message=Buy StayPuft Marshmallows!
```


PropertiesTestthen usesSystem.setPropertiesto install the newPropertiesobjects as the current set of system properties.


```java
import java.io.FileInputStream;
import java.util.Properties;

public class PropertiesTest {
    public static void main(String[] args)
        throws Exception {

        // set up new properties object
        // from file "myProperties.txt"
        FileInputStream propFile =
            new FileInputStream( "myProperties.txt");
        Properties p =
            new Properties(System.getProperties());
        p.load(propFile);

        // set the system properties
        System.setProperties(p);
        // display new properties
        System.getProperties().list(System.out);
    }
}
```


Note howPropertiesTestcreates thePropertiesobject,p, which is used as the argument tosetProperties:


```java
Properties p = new Properties(System.getProperties());
```


This statement initializes the new properties object,p, with the current set of system properties, which in the case of this small application, is the set of properties initialized by the runtime system. Then the application loads additional properties intopfrom the filemyProperties.txtand sets the system properties top. This has the effect of adding the properties listed inmyProperties.txtto the set of properties created by the runtime system at startup. Note that an application can createpwithout any defaultPropertiesobject, like this:


```java
Properties p = new Properties();
```


Also note that the value of system properties can be overwritten! For example, ifmyProperties.txtcontains the following line, thejava.vendorsystem property will be overwritten:


```java
java.vendor=Acme Software Company
```


In general, be careful not to overwrite system properties.


ThesetPropertiesmethod changes the set of system properties for the current running application. These changes are not persistent. That is, changing the system properties within an application will not affect future invocations of the Java interpreter for this or any other application. The runtime system re-initializes the system properties each time its starts up. If changes to system properties are to be persistent, then the application must write the values to some file before exiting and read them in again upon startup.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/environment/security.html


Asecurity manageris an object that defines a security policy for an application. This policy specifies actions that are unsafe or sensitive. Any actions not allowed by the security policy cause aSecurityExceptionto be thrown. An application can also query its security manager to discover which actions are allowed.


Typically, a web applet runs with a security manager provided by the browser or Java Web Start plugin. Other kinds of applications normally run without a security manager, unless the application itself defines one. If no security manager is present, the application has no security policy and acts without restrictions.


This section explains how an application interacts with an existing security manager. For more detailed information, including information on how to design a security manager, refer to theSecurity Guide.


## Interacting with the Security Manager


The security manager is an object of typeSecurityManager; to obtain a reference to this object, invokeSystem.getSecurityManager.


```java
SecurityManager appsm = System.getSecurityManager();
```


If there is no security manager, this method returnsnull.


Once an application has a reference to the security manager object, it can request permission to do specific things. Many classes in the standard libraries do this. For example,System.exit, which terminates the Java virtual machine with an exit status, invokesSecurityManager.checkExitto ensure that the current thread has permission to shut down the application.


The SecurityManager class defines many other methods used to verify other kinds of operations. For example,SecurityManager.checkAccessverifies thread accesses, andSecurityManager.checkPropertyAccessverifies access to the specified property. Each operation or group of operations has its owncheckXXX()method.


In addition, the set ofcheckXXX()methods represents the set of operations that are already subject to the protection of the security manager. Typically, an application does not have to directly invoke anycheckXXX()methods.


## Recognizing a Security Violation


Many actions that are routine without a security manager can throw aSecurityExceptionwhen run with a security manager. This is true even when invoking a method that isn't documented as throwingSecurityException. For example, consider the following code used to write to a file:


```java
reader = new FileWriter("xanadu.txt");
```


In the absence of a security manager, this statement executes without error, providedxanadu.txtexists and is writeable. But suppose this statement is inserted in a web applet, which typically runs under a security manager that does not allow file output. The following error messages might result:


```java
appletviewer fileApplet.html
    Exception in thread "AWT-EventQueue-1" java.security.AccessControlException: access denied (java.io.FilePermission xanadu.txt write)
        at java.security.AccessControlContext.checkPermission(AccessControlContext.java:323)
        at java.security.AccessController.checkPermission(AccessController.java:546)
        at java.lang.SecurityManager.checkPermission(SecurityManager.java:532)
        at java.lang.SecurityManager.checkWrite(SecurityManager.java:962)
        at java.io.FileOutputStream.<init>(FileOutputStream.java:169)
        at java.io.FileOutputStream.<init>(FileOutputStream.java:70)
        at java.io.FileWriter.<init>(FileWriter.java:46)
...
```


Note that the specific exception thrown in this case,java.security.AccessControlException, is a subclass ofSecurityException.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/environment/sysmisc.html


This section describes some of the methods inSystemthat aren't covered in the previous sections.


ThearrayCopymethod efficiently copies data between arrays. For more information, refer toArraysin theLanguage Basicslesson.


ThecurrentTimeMillisandnanoTimemethods are useful for measuring time intervals during execution of an application. To measure a time interval in milliseconds, invokecurrentTimeMillistwice, at the beginning and end of the interval, and subtract the first value returned from the second. Similarly, invokingnanoTimetwice measures an interval in nanoseconds.


Theexitmethod causes the Java virtual machine to shut down, with an integer exit status specified by the argument. The exit status is available to the process that launched the application. By convention, an exit status of0indicates normal termination of the application, while any other value is an error code.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/environment/paths.html


This section explains how to use thePATHandCLASSPATHenvironment variables on Microsoft Windows, Solaris, and Linux. Consult the installation instructions included with your installation of the Java Development Kit (JDK) software bundle for current information.


After installing the software, the JDK directory will have the structure shown below.


Thebindirectory contains both the compiler and the launcher.


## Update the PATH Environment Variable (Microsoft Windows)


You can run Java applications just fine without setting thePATHenvironment variable. Or, you can optionally set it as a convenience.


Set thePATHenvironment variable if you want to be able to conveniently run the executables (javac.exe,java.exe,javadoc.exe, and so on) from any directory without having to type the full path of the command. If you do not set thePATHvariable, you need to specify the full path to the executable every time you run it, such as:


```java
C:\Java\jdk1.7.0\bin\javac MyClass.java
```


ThePATHenvironment variable is a series of directories separated by semicolons (;). Microsoft Windows looks for programs in thePATHdirectories in order, from left to right. You should have only onebindirectory for the JDK in the path at a time (those following the first are ignored), so if one is already present, you can update that particular entry.


The following is an example of aPATHenvironment variable:


```java
C:\Java\jdk1.7.0\bin;C:\Windows\System32\;C:\Windows\;C:\Windows\System32\Wbem
```


It is useful to set thePATHenvironment variable permanently so it will persist after rebooting. To make a permanent change to thePATHvariable, use theSystemicon in the Control Panel. The precise procedure varies depending on the version of Windows:

- Select Start , select Control Panel . double click System , and select the Advanced tab.
- Click Environment Variables . In the section System Variables , find the PATH environment variable and select it. Click Edit . If the PATH environment variable does not exist, click New .
- In the Edit System Variable (or New System Variable ) window, specify the value of the PATH environment variable. Click OK . Close all remaining windows by clicking OK .
- From the desktop, right click the My Computer icon.
- Choose Properties from the context menu.
- Click the Advanced tab ( Advanced system settings link in Vista).
- Click Environment Variables . In the section System Variables , find the PATH environment variable and select it. Click Edit . If the PATH environment variable does not exist, click New .
- In the Edit System Variable (or New System Variable ) window, specify the value of the PATH environment variable. Click OK . Close all remaining windows by clicking OK .
- From the desktop, right click the Computer icon.
- Choose Properties from the context menu.
- Click the Advanced system settings link.
- Click Environment Variables . In the section System Variables , find the PATH environment variable and select it. Click Edit . If the PATH environment variable does not exist, click New .
- In the Edit System Variable (or New System Variable ) window, specify the value of the PATH environment variable. Click OK . Close all remaining windows by clicking OK .

```java
%JAVA_HOME%\bin;%SystemRoot%\system32;%SystemRoot%;%SystemRoot%\System32\Wbem
```


```java
echo %SystemRoot%
```


## Update the PATH Variable (Solaris and Linux)


You can run the JDK just fine without setting thePATHvariable, or you can optionally set it as a convenience. However, you should set the path variable if you want to be able to run the executables (javac,java,javadoc, and so on) from any directory without having to type the full path of the command. If you do not set thePATHvariable, you need to specify the full path to the executable every time you run it, such as:


```java
% /usr/local/jdk1.7.0/bin/javac MyClass.java
```


To find out if the path is properly set, execute:


```java
% java -version
```


This will print the version of thejavatool, if it can find it. If the version is old or you get the errorjava: Command not found, then the path is not properly set.


To set the path permanently, set the path in your startup file.


For C shell (csh), edit the startup file(~/.cshrc):


```java
set path=(/usr/local/jdk1.7.0/bin $path)
```


Forbash, edit the startup file (~/.bashrc):


```java
PATH=/usr/local/jdk1.7.0/bin:$PATH
export PATH
```


Forksh, the startup file is named by the environment variable,ENV. To set the path:


```java
PATH=/usr/local/jdk1.7.0/bin:$PATH
export PATH
```


Forsh, edit the profile file (~/.profile):


```java
PATH=/usr/local/jdk1.7.0/bin:$PATH
export PATH
```


Then load the startup file and verify that the path is set by repeating thejavacommand:


For C shell (csh):


```java
% source ~/.cshrc
% java -version
```


Forksh,bash, orsh:


```java
% . /.profile
% java -version
```


## Checking the CLASSPATH variable (All platforms)


TheCLASSPATHvariable is one way to tell applications, including the JDK tools, where to look for user classes. (Classes that are part of the JRE, JDK platform, and extensions should be defined through other means, such as the bootstrap class path or the extensions directory.)


The preferred way to specify the class path is by using the-cpcommand line switch. This allows theCLASSPATHto be set individually for each application without affecting other applications.Setting theCLASSPATHcan be tricky and should be performed with care.


The default value of the class path is ".", meaning that only the current directory is searched. Specifying either the CLASSPATH variable or the-cpcommand line switch overrides this value.


To check whetherCLASSPATHis set on Microsoft Windows NT/2000/XP, execute the following:


```java
C:> echo %CLASSPATH%
```


On Solaris or Linux, execute the following:


```java
% echo $CLASSPATH
```


IfCLASSPATHis not set you will get aCLASSPATH: Undefined variableerror (Solaris or Linux) or simply%CLASSPATH%(Microsoft Windows NT/2000/XP).


To modify theCLASSPATH, use the same procedure you used for thePATHvariable.


Class path wildcards allow you to include an entire directory of.jarfiles in the class path without explicitly naming them individually. For more information, including an explanation of class path wildcards, and a detailed description on how to clean up theCLASSPATHenvironment variable, see theSetting the Class Pathtechnical note.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/environment/QandE/questions.html


## Questions


1. A programmer installs a new library contained in a .jar file. In order to access the library from his code, he sets the CLASSPATH environment variable to point to the new .jar file. Now he finds that he gets an error message when he tries to launch simple applications:


```java
java Hello
Exception in thread "main" java.lang.NoClassDefFoundError: Hello
```


In this case, theHelloclass is compiled into a .class file in the current directory — yet thejavacommand can't seem to find it. What's going wrong?


## Exercises


1. Write an application,PersistentEcho, with the following features:

- If PersistentEcho is run with command line arguments, it prints out those arguments. It also saves the string printed out to a property, and saves the property to a file called PersistentEcho.txt
- If PersistentEcho is run with no command line arguments, it looks for an environment variable called PERSISTENTECHO. If that variable exists, PersistentEcho prints out its value, and also saves the value in the same way it does for command line arguments.
- If PersistentEcho is run with no command line arguments, and the PERSISTENTECHO environment variable is not defined, it retrieves the property value from PersistentEcho.txt and prints that out.

Check your answers.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/regex/index.html


This lesson explains how to use thejava.util.regexAPI for pattern matching with regular expressions. Although the syntax accepted by this package is similar to thePerlprogramming language, knowledge of Perl is not a prerequisite. This lesson starts with the basics, and gradually builds to cover more advanced techniques.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/regex/intro.html


## What Are Regular Expressions?


Regular expressionsare a way to describe a set of strings based on common characteristics shared by each string in the set. They can be used to search, edit, or manipulate text and data. You must learn a specific syntax to create regular expressions — one that goes beyond the normal syntax of the Java programming language. Regular expressions vary in complexity, but once you understand the basics of how they're constructed, you'll be able to decipher (or create) any regular expression.


This trail teaches the regular expression syntax supported by thejava.util.regexAPI and presents several working examples to illustrate how the various objects interact. In the world of regular expressions, there are many different flavors to choose from, such as grep, Perl, Tcl, Python, PHP, and awk. The regular expression syntax in thejava.util.regexAPI is most similar to that found in Perl.


## How Are Regular Expressions Represented in This Package?


Thejava.util.regexpackage primarily consists of three classes:Pattern,Matcher, andPatternSyntaxException.

- A Pattern object is a compiled representation of a regular expression. The Pattern class provides no public constructors. To create a pattern, you must first invoke one of its public static compile methods, which will then return a Pattern object. These methods accept a regular expression as the first argument; the first few lessons of this trail will teach you the required syntax.
- A Matcher object is the engine that interprets the pattern and performs match operations against an input string. Like the Pattern class, Matcher defines no public constructors. You obtain a Matcher object by invoking the matcher method on a Pattern object.
- A PatternSyntaxException object is an unchecked exception that indicates a syntax error in a regular expression pattern.

The last few lessons of this trail explore each class in detail. But first, you must understand how regular expressions are actually constructed. Therefore, the next section introduces a simple test harness that will be used repeatedly to explore their syntax.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/regex/test_harness.html


This section defines a reusable test harness,RegexTestHarness.java, for exploring the regular expression constructs supported by this API. The command to run this code isjava RegexTestHarness; no command-line arguments are accepted. The application loops repeatedly, prompting the user for a regular expression and input string. Using this test harness is optional, but you may find it convenient for exploring the test cases discussed in the following pages.


```java
import java.io.Console;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class RegexTestHarness {

    public static void main(String[] args){
        Console console = System.console();
        if (console == null) {
            System.err.println("No console.");
            System.exit(1);
        }
        while (true) {

            Pattern pattern = 
            Pattern.compile(console.readLine("%nEnter your regex: "));

            Matcher matcher = 
            pattern.matcher(console.readLine("Enter input string to search: "));

            boolean found = false;
            while (matcher.find()) {
                console.format("I found the text" +
                    " \"%s\" starting at " +
                    "index %d and ending at index %d.%n",
                    matcher.group(),
                    matcher.start(),
                    matcher.end());
                found = true;
            }
            if(!found){
                console.format("No match found.%n");
            }
        }
    }
}
```


Before continuing to the next section, save and compile this code to ensure that your development environment supports the required packages.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/regex/literals.html


The most basic form of pattern matching supported by this API is the match of a string literal. For example, if the regular expression isfooand the input string isfoo, the match will succeed because the strings are identical. Try this out with the test harness:


```java
Enter your regex: foo
Enter input string to search: foo
I found the text foo starting at index 0 and ending at index 3.
```


This match was a success. Note that while the input string is 3 characters long, the start index is 0 and the end index is 3. By convention, ranges are inclusive of the beginning index and exclusive of the end index, as shown in the following figure:


The string literal foo, with numbered cells and index values.


Each character in the string resides in its owncell, with the index positions pointing between each cell. The string "foo" starts at index 0 and ends at index 3, even though the characters themselves only occupy cells 0, 1, and 2.


With subsequent matches, you'll notice some overlap; the start index for the next match is the same as the end index of the previous match:


```java
Enter your regex: foo
Enter input string to search: foofoofoo
I found the text foo starting at index 0 and ending at index 3.
I found the text foo starting at index 3 and ending at index 6.
I found the text foo starting at index 6 and ending at index 9.
```


## Metacharacters


This API also supports a number of special characters that affect the way a pattern is matched. Change the regular expression tocat.and the input string tocats. The output will appear as follows:


```java
Enter your regex: cat.
Enter input string to search: cats
I found the text cats starting at index 0 and ending at index 4.
```


The match still succeeds, even though the dot "." is not present in the input string. It succeeds because the dot is ametacharacter— a character with special meaning interpreted by the matcher. The metacharacter "." means "any character" which is why the match succeeds in this example.


The metacharacters supported by this API are:<([{\^-=$!|]})?*+.>


There are two ways to force a metacharacter to be treated as an ordinary character:

- precede the metacharacter with a backslash, or
- enclose it within \Q (which starts the quote) and \E (which ends it).

When using this technique, the\Qand\Ecan be placed at any location within the expression, provided that the\Qcomes first.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/regex/char_classes.html


If you browse through thePatternclass specification, you'll see tables summarizing the supported regular expression constructs. In the "Character Classes" section you'll find the following:


The left-hand column specifies the regular expression constructs, while the right-hand column describes the conditions under which each construct will match.


## Simple Classes


The most basic form of a character class is to simply place a set of characters side-by-side within square brackets. For example, the regular expression[bcr]atwill match the words "bat", "cat", or "rat" because it defines a character class (accepting either "b", "c", or "r") as its first character.


```java
Enter your regex: [bcr]at
Enter input string to search: bat
I found the text "bat" starting at index 0 and ending at index 3.

Enter your regex: [bcr]at
Enter input string to search: cat
I found the text "cat" starting at index 0 and ending at index 3.

Enter your regex: [bcr]at
Enter input string to search: rat
I found the text "rat" starting at index 0 and ending at index 3.

Enter your regex: [bcr]at
Enter input string to search: hat
No match found.
```


In the above examples, the overall match succeeds only when the first letter matches one of the characters defined by the character class.


### Negation


To match all charactersexceptthose listed, insert the "^" metacharacter at the beginning of the character class. This technique is known asnegation.


```java
Enter your regex: [^bcr]at
Enter input string to search: bat
No match found.

Enter your regex: [^bcr]at
Enter input string to search: cat
No match found.

Enter your regex: [^bcr]at
Enter input string to search: rat
No match found.

Enter your regex: [^bcr]at
Enter input string to search: hat
I found the text "hat" starting at index 0 and ending at index 3.
```


The match is successful only if the first character of the input string doesnotcontain any of the characters defined by the character class.


### Ranges


Sometimes you'll want to define a character class that includes a range of values, such as the letters "a through h" or the numbers "1 through 5". To specify a range, simply insert the "-" metacharacter between the first and last character to be matched, such as[1-5]or[a-h]. You can also place different ranges beside each other within the class to further expand the match possibilities. For example,[a-zA-Z]will match any letter of the alphabet: a to z (lowercase) or A to Z (uppercase).


Here are some examples of ranges and negation:


```java
Enter your regex: [a-c]
Enter input string to search: a
I found the text "a" starting at index 0 and ending at index 1.

Enter your regex: [a-c]
Enter input string to search: b
I found the text "b" starting at index 0 and ending at index 1.

Enter your regex: [a-c]
Enter input string to search: c
I found the text "c" starting at index 0 and ending at index 1.

Enter your regex: [a-c]
Enter input string to search: d
No match found.

Enter your regex: foo[1-5]
Enter input string to search: foo1
I found the text "foo1" starting at index 0 and ending at index 4.

Enter your regex: foo[1-5]
Enter input string to search: foo5
I found the text "foo5" starting at index 0 and ending at index 4.

Enter your regex: foo[1-5]
Enter input string to search: foo6
No match found.

Enter your regex: foo[^1-5]
Enter input string to search: foo1
No match found.

Enter your regex: foo[^1-5]
Enter input string to search: foo6
I found the text "foo6" starting at index 0 and ending at index 4.
```


### Unions


You can also useunionsto create a single character class comprised of two or more separate character classes. To create a union, simply nest one class inside the other, such as[0-4[6-8]]. This particular union creates a single character class that matches the numbers 0, 1, 2, 3, 4, 6, 7, and 8.


```java
Enter your regex: [0-4[6-8]]
Enter input string to search: 0
I found the text "0" starting at index 0 and ending at index 1.

Enter your regex: [0-4[6-8]]
Enter input string to search: 5
No match found.

Enter your regex: [0-4[6-8]]
Enter input string to search: 6
I found the text "6" starting at index 0 and ending at index 1.

Enter your regex: [0-4[6-8]]
Enter input string to search: 8
I found the text "8" starting at index 0 and ending at index 1.

Enter your regex: [0-4[6-8]]
Enter input string to search: 9
No match found.
```


### Intersections


To create a single character class matching only the characters common to all of its nested classes, use&&, as in[0-9&&[345]]. This particular intersection creates a single character class matching only the numbers common to both character classes: 3, 4, and 5.


```java
Enter your regex: [0-9&&[345]]
Enter input string to search: 3
I found the text "3" starting at index 0 and ending at index 1.

Enter your regex: [0-9&&[345]]
Enter input string to search: 4
I found the text "4" starting at index 0 and ending at index 1.

Enter your regex: [0-9&&[345]]
Enter input string to search: 5
I found the text "5" starting at index 0 and ending at index 1.

Enter your regex: [0-9&&[345]]
Enter input string to search: 2
No match found.

Enter your regex: [0-9&&[345]]
Enter input string to search: 6
No match found.
```


And here's an example that shows the intersection of two ranges:


```java
Enter your regex: [2-8&&[4-6]]
Enter input string to search: 3
No match found.

Enter your regex: [2-8&&[4-6]]
Enter input string to search: 4
I found the text "4" starting at index 0 and ending at index 1.

Enter your regex: [2-8&&[4-6]]
Enter input string to search: 5
I found the text "5" starting at index 0 and ending at index 1.

Enter your regex: [2-8&&[4-6]]
Enter input string to search: 6
I found the text "6" starting at index 0 and ending at index 1.

Enter your regex: [2-8&&[4-6]]
Enter input string to search: 7
No match found.
```


### Subtraction


Finally, you can usesubtractionto negate one or more nested character classes, such as[0-9&&[^345]]. This example creates a single character class that matches everything from 0 to 9,exceptthe numbers 3, 4, and 5.


```java
Enter your regex: [0-9&&[^345]]
Enter input string to search: 2
I found the text "2" starting at index 0 and ending at index 1.

Enter your regex: [0-9&&[^345]]
Enter input string to search: 3
No match found.

Enter your regex: [0-9&&[^345]]
Enter input string to search: 4
No match found.

Enter your regex: [0-9&&[^345]]
Enter input string to search: 5
No match found.

Enter your regex: [0-9&&[^345]]
Enter input string to search: 6
I found the text "6" starting at index 0 and ending at index 1.

Enter your regex: [0-9&&[^345]]
Enter input string to search: 9
I found the text "9" starting at index 0 and ending at index 1.
```


Now that we've covered how character classes are created, You may want to review theCharacter Classes tablebefore continuing with the next section.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/regex/pre_char_classes.html


ThePatternAPI contains a number of usefulpredefined character classes, which offer convenient shorthands for commonly used regular expressions:


In the table above, each construct in the left-hand column is shorthand for the character class in the right-hand column. For example,\dmeans a range of digits (0-9), and\wmeans a word character (any lowercase letter, any uppercase letter, the underscore character, or any digit). Use the predefined classes whenever possible. They make your code easier to read and eliminate errors introduced by malformed character classes.


Constructs beginning with a backslash are calledescaped constructs. We previewed escaped constructs in theString Literalssection where we mentioned the use of backslash and\Qand\Efor quotation. If you are using an escaped construct within a string literal, you must precede the backslash with another backslash for the string to compile. For example:


```java
private final String REGEX = "\\d"; // a single digit
```


In this example\dis the regular expression; the extra backslash is required for the code to compile. The test harness reads the expressions directly from theConsole, however, so the extra backslash is unnecessary.


The following examples demonstrate the use of predefined character classes.


```java
Enter your regex: .
Enter input string to search: @
I found the text "@" starting at index 0 and ending at index 1.

Enter your regex: . 
Enter input string to search: 1
I found the text "1" starting at index 0 and ending at index 1.

Enter your regex: .
Enter input string to search: a
I found the text "a" starting at index 0 and ending at index 1.

Enter your regex: \d
Enter input string to search: 1
I found the text "1" starting at index 0 and ending at index 1.

Enter your regex: \d
Enter input string to search: a
No match found.

Enter your regex: \D
Enter input string to search: 1
No match found.

Enter your regex: \D
Enter input string to search: a
I found the text "a" starting at index 0 and ending at index 1.

Enter your regex: \s
Enter input string to search:  
I found the text " " starting at index 0 and ending at index 1.

Enter your regex: \s
Enter input string to search: a
No match found.

Enter your regex: \S
Enter input string to search:  
No match found.

Enter your regex: \S
Enter input string to search: a
I found the text "a" starting at index 0 and ending at index 1.

Enter your regex: \w
Enter input string to search: a
I found the text "a" starting at index 0 and ending at index 1.

Enter your regex: \w
Enter input string to search: !
No match found.

Enter your regex: \W
Enter input string to search: a
No match found.

Enter your regex: \W
Enter input string to search: !
I found the text "!" starting at index 0 and ending at index 1.
```


In the first three examples, the regular expression is simply.(the "dot" metacharacter) that indicates "any character." Therefore, the match is successful in all three cases (a randomly selected@character, a digit, and a letter). The remaining examples each use a single regular expression construct from thePredefined Character Classes table. You can refer to this table to figure out the logic behind each match:

- \d matches all digits
- \s matches spaces
- \w matches word characters

Alternatively, a capital letter means the opposite:

- \D matches non-digits
- \S matches non-spaces
- \W matches non-word characters

---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/regex/quant.html


Quantifiersallow you to specify the number of occurrences to match against. For convenience, the three sections of the Pattern API specification describing greedy, reluctant, and possessive quantifiers are presented below. At first glance it may appear that the quantifiersX?,X??andX?+do exactly the same thing, since they all promise to match "X, once or not at all". There are subtle implementation differences which will be explained near the end of this section.


Let's start our look at greedy quantifiers by creating three different regular expressions: the letter "a" followed by either?,*, or+. Let's see what happens when these expressions are tested against an empty input string"":


```java
Enter your regex: a?
Enter input string to search: 
I found the text "" starting at index 0 and ending at index 0.

Enter your regex: a*
Enter input string to search: 
I found the text "" starting at index 0 and ending at index 0.

Enter your regex: a+
Enter input string to search: 
No match found.
```


## Zero-Length Matches


In the above example, the match is successful in the first two cases because the expressionsa?anda*both allow for zero occurrences of the lettera. You'll also notice that the start and end indices are both zero, which is unlike any of the examples we've seen so far. The empty input string""has no length, so the test simply matches nothing at index 0. Matches of this sort are known as azero-length matches. A zero-length match can occur in several cases: in an empty input string, at the beginning of an input string, after the last character of an input string, or in between any two characters of an input string. Zero-length matches are easily identifiable because they always start and end at the same index position.


Let's explore zero-length matches with a few more examples. Change the input string to a single letter "a" and you'll notice something interesting:


```java
Enter your regex: a?
Enter input string to search: a
I found the text "a" starting at index 0 and ending at index 1.
I found the text "" starting at index 1 and ending at index 1.

Enter your regex: a*
Enter input string to search: a
I found the text "a" starting at index 0 and ending at index 1.
I found the text "" starting at index 1 and ending at index 1.

Enter your regex: a+
Enter input string to search: a
I found the text "a" starting at index 0 and ending at index 1.
```


All three quantifiers found the letter "a", but the first two also found a zero-length match at index 1; that is, after the last character of the input string. Remember, the matcher sees the character "a" as sitting in the cell between index 0 and index 1, and our test harness loops until it can no longer find a match. Depending on the quantifier used, the presence of "nothing" at the index after the last character may or may not trigger a match.


Now change the input string to the letter "a" five times in a row and you'll get the following:


```java
Enter your regex: a?
Enter input string to search: aaaaa
I found the text "a" starting at index 0 and ending at index 1.
I found the text "a" starting at index 1 and ending at index 2.
I found the text "a" starting at index 2 and ending at index 3.
I found the text "a" starting at index 3 and ending at index 4.
I found the text "a" starting at index 4 and ending at index 5.
I found the text "" starting at index 5 and ending at index 5.

Enter your regex: a*
Enter input string to search: aaaaa
I found the text "aaaaa" starting at index 0 and ending at index 5.
I found the text "" starting at index 5 and ending at index 5.

Enter your regex: a+
Enter input string to search: aaaaa
I found the text "aaaaa" starting at index 0 and ending at index 5.
```


The expressiona?finds an individual match for each character, since it matches when "a" appears zero or one times. The expressiona*finds two separate matches: all of the letter "a"'s in the first match, then the zero-length match after the last character at index 5. And finally,a+matches all occurrences of the letter "a", ignoring the presence of "nothing" at the last index.


At this point, you might be wondering what the results would be if the first two quantifiers encounter a letter other than "a". For example, what happens if it encounters the letter "b", as in "ababaaaab"?


Let's find out:


```java
Enter your regex: a?
Enter input string to search: ababaaaab
I found the text "a" starting at index 0 and ending at index 1.
I found the text "" starting at index 1 and ending at index 1.
I found the text "a" starting at index 2 and ending at index 3.
I found the text "" starting at index 3 and ending at index 3.
I found the text "a" starting at index 4 and ending at index 5.
I found the text "a" starting at index 5 and ending at index 6.
I found the text "a" starting at index 6 and ending at index 7.
I found the text "a" starting at index 7 and ending at index 8.
I found the text "" starting at index 8 and ending at index 8.
I found the text "" starting at index 9 and ending at index 9.

Enter your regex: a*
Enter input string to search: ababaaaab
I found the text "a" starting at index 0 and ending at index 1.
I found the text "" starting at index 1 and ending at index 1.
I found the text "a" starting at index 2 and ending at index 3.
I found the text "" starting at index 3 and ending at index 3.
I found the text "aaaa" starting at index 4 and ending at index 8.
I found the text "" starting at index 8 and ending at index 8.
I found the text "" starting at index 9 and ending at index 9.

Enter your regex: a+
Enter input string to search: ababaaaab
I found the text "a" starting at index 0 and ending at index 1.
I found the text "a" starting at index 2 and ending at index 3.
I found the text "aaaa" starting at index 4 and ending at index 8.
```


Even though the letter "b" appears in cells 1, 3, and 8, the output reports a zero-length match at those locations. The regular expressiona?is not specifically looking for the letter "b"; it's merely looking for the presence (or lack thereof) of the letter "a". If the quantifier allows for a match of "a" zero times, anything in the input string that's not an "a" will show up as a zero-length match. The remaining a's are matched according to the rules discussed in the previous examples.


To match a pattern exactlynnumber of times, simply specify the number inside a set of braces:


```java
Enter your regex: a{3}
Enter input string to search: aa
No match found.

Enter your regex: a{3}
Enter input string to search: aaa
I found the text "aaa" starting at index 0 and ending at index 3.

Enter your regex: a{3}
Enter input string to search: aaaa
I found the text "aaa" starting at index 0 and ending at index 3.
```


Here, the regular expressiona{3}is searching for three occurrences of the letter "a" in a row. The first test fails because the input string does not have enough a's to match against. The second test contains exactly 3 a's in the input string, which triggers a match. The third test also triggers a match because there are exactly 3 a's at the beginning of the input string. Anything following that is irrelevant to the first match. If the pattern should appear again after that point, it would trigger subsequent matches:


```java
Enter your regex: a{3}
Enter input string to search: aaaaaaaaa
I found the text "aaa" starting at index 0 and ending at index 3.
I found the text "aaa" starting at index 3 and ending at index 6.
I found the text "aaa" starting at index 6 and ending at index 9.
```


To require a pattern to appear at leastntimes, add a comma after the number:


```java
Enter your regex: a{3,}
Enter input string to search: aaaaaaaaa
I found the text "aaaaaaaaa" starting at index 0 and ending at index 9.
```


With the same input string, this test finds only one match, because the 9 a's in a row satisfy the need for "at least" 3 a's.


Finally, to specify an upper limit on the number of occurrences, add a second number inside the braces:


```java
Enter your regex: a{3,6} // find at least 3 (but no more than 6) a's in a row
Enter input string to search: aaaaaaaaa
I found the text "aaaaaa" starting at index 0 and ending at index 6.
I found the text "aaa" starting at index 6 and ending at index 9.
```


Here the first match is forced to stop at the upper limit of 6 characters. The second match includes whatever is left over, which happens to be three a's — the minimum number of characters allowed for this match. If the input string were one character shorter, there would not be a second match since only two a's would remain.


## Capturing Groups and Character Classes with Quantifiers


Until now, we've only tested quantifiers on input strings containing one character. In fact, quantifiers can only attach to one character at a time, so the regular expression "abc+" would mean "a, followed by b, followed by c one or more times". It would not mean "abc" one or more times. However, quantifiers can also attach toCharacter ClassesandCapturing Groups, such as[abc]+(a or b or c, one or more times) or(abc)+(the group "abc", one or more times).


Let's illustrate by specifying the group(dog), three times in a row.


```java
Enter your regex: (dog){3}
Enter input string to search: dogdogdogdogdogdog
I found the text "dogdogdog" starting at index 0 and ending at index 9.
I found the text "dogdogdog" starting at index 9 and ending at index 18.

Enter your regex: dog{3}
Enter input string to search: dogdogdogdogdogdog
No match found.
```


Here the first example finds three matches, since the quantifier applies to the entire capturing group. Remove the parentheses, however, and the match fails because the quantifier{3}now applies only to the letter "g".


Similarly, we can apply a quantifier to an entire character class:


```java
Enter your regex: [abc]{3}
Enter input string to search: abccabaaaccbbbc
I found the text "abc" starting at index 0 and ending at index 3.
I found the text "cab" starting at index 3 and ending at index 6.
I found the text "aaa" starting at index 6 and ending at index 9.
I found the text "ccb" starting at index 9 and ending at index 12.
I found the text "bbc" starting at index 12 and ending at index 15.

Enter your regex: abc{3}
Enter input string to search: abccabaaaccbbbc
No match found.
```


Here the quantifier{3}applies to the entire character class in the first example, but only to the letter "c" in the second.


## Differences Among Greedy, Reluctant, and Possessive Quantifiers


There are subtle differences among greedy, reluctant, and possessive quantifiers.


Greedy quantifiers are considered "greedy" because they force the matcher to read in, oreat, the entire input string prior to attempting the first match. If the first match attempt (the entire input string) fails, the matcher backs off the input string by one character and tries again, repeating the process until a match is found or there are no more characters left to back off from. Depending on the quantifier used in the expression, the last thing it will try matching against is 1 or 0 characters.


The reluctant quantifiers, however, take the opposite approach: They start at the beginning of the input string, then reluctantly eat one character at a time looking for a match. The last thing they try is the entire input string.


Finally, the possessive quantifiers always eat the entire input string, trying once (and only once) for a match. Unlike the greedy quantifiers, possessive quantifiers never back off, even if doing so would allow the overall match to succeed.


To illustrate, consider the input stringxfooxxxxxxfoo.


```java
Enter your regex: .*foo  // greedy quantifier
Enter input string to search: xfooxxxxxxfoo
I found the text "xfooxxxxxxfoo" starting at index 0 and ending at index 13.

Enter your regex: .*?foo  // reluctant quantifier
Enter input string to search: xfooxxxxxxfoo
I found the text "xfoo" starting at index 0 and ending at index 4.
I found the text "xxxxxxfoo" starting at index 4 and ending at index 13.

Enter your regex: .*+foo // possessive quantifier
Enter input string to search: xfooxxxxxxfoo
No match found.
```


The first example uses the greedy quantifier.*to find "anything", zero or more times, followed by the letters"f" "o" "o". Because the quantifier is greedy, the.*portion of the expression first eats the entire input string. At this point, the overall expression cannot succeed, because the last three letters ("f" "o" "o") have already been consumed. So the matcher slowly backs off one letter at a time until the rightmost occurrence of "foo" has been regurgitated, at which point the match succeeds and the search ends.


The second example, however, is reluctant, so it starts by first consuming "nothing". Because "foo" doesn't appear at the beginning of the string, it's forced to swallow the first letter (an "x"), which triggers the first match at 0 and 4. Our test harness continues the process until the input string is exhausted. It finds another match at 4 and 13.


The third example fails to find a match because the quantifier is possessive. In this case, the entire input string is consumed by.*+, leaving nothing left over to satisfy the "foo" at the end of the expression. Use a possessive quantifier for situations where you want to seize all of something without ever backing off; it will outperform the equivalent greedy quantifier in cases where the match is not immediately found.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/regex/groups.html


In theprevious section, we saw how quantifiers attach to one character, character class, or capturing group at a time. But until now, we have not discussed the notion of capturing groups in any detail.


Capturing groupsare a way to treat multiple characters as a single unit. They are created by placing the characters to be grouped inside a set of parentheses. For example, the regular expression(dog)creates a single group containing the letters"d" "o"and"g". The portion of the input string that matches the capturing group will be saved in memory for later recall via backreferences (as discussed below in the section,Backreferences).


## Numbering


As described in thePatternAPI, capturing groups are numbered by counting their opening parentheses from left to right. In the expression((A)(B(C))), for example, there are four such groups:

- ((A)(B(C)))
- (A)
- (B(C))
- (C)

To find out how many groups are present in the expression, call thegroupCountmethod on a matcher object. ThegroupCountmethod returns anintshowing the number of capturing groups present in the matcher's pattern. In this example,groupCountwould return the number4, showing that the pattern contains 4 capturing groups.


There is also a special group, group 0, which always represents the entire expression. This group is not included in the total reported bygroupCount. Groups beginning with(?are pure,non-capturing groupsthat do not capture text and do not count towards the group total. (You'll see examples of non-capturing groups later in the sectionMethods of the Pattern Class.)


It's important to understand how groups are numbered because someMatchermethods accept anintspecifying a particular group number as a parameter:

- public int start(int group) : Returns the start index of the subsequence captured by the given group during the previous match operation.
- public int end (int group) : Returns the index of the last character, plus one, of the subsequence captured by the given group during the previous match operation.
- public String group (int group) : Returns the input subsequence captured by the given group during the previous match operation.

## Backreferences


The section of the input string matching the capturing group(s) is saved in memory for later recall viabackreference. A backreference is specified in the regular expression as a backslash (\) followed by a digit indicating the number of the group to be recalled. For example, the expression(\d\d)defines one capturing group matching two digits in a row, which can be recalled later in the expression via the backreference\1.


To match any 2 digits, followed by the exact same two digits, you would use(\d\d)\1as the regular expression:


```java
Enter your regex: (\d\d)\1
Enter input string to search: 1212
I found the text "1212" starting at index 0 and ending at index 4.
```


If you change the last two digits the match will fail:


```java
Enter your regex: (\d\d)\1
Enter input string to search: 1234
No match found.
```


For nested capturing groups, backreferencing works in exactly the same way: Specify a backslash followed by the number of the group to be recalled.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/regex/bounds.html


Until now, we've only been interested in whether or not a match is foundat some locationwithin a particular input string. We never cared aboutwherein the string the match was taking place.


You can make your pattern matches more precise by specifying such information withboundary matchers. For example, maybe you're interested in finding a particular word, but only if it appears at the beginning or end of a line. Or maybe you want to know if the match is taking place on a word boundary, or at the end of the previous match.


The following table lists and explains all the boundary matchers.


The following examples demonstrate the use of boundary matchers^and$. As noted above,^matches the beginning of a line, and$matches the end.


```java
Enter your regex: ^dog$
Enter input string to search: dog
I found the text "dog" starting at index 0 and ending at index 3.

Enter your regex: ^dog$
Enter input string to search:       dog
No match found.

Enter your regex: \s*dog$
Enter input string to search:             dog
I found the text "            dog" starting at index 0 and ending at index 15.

Enter your regex: ^dog\w*
Enter input string to search: dogblahblah
I found the text "dogblahblah" starting at index 0 and ending at index 11.
```


The first example is successful because the pattern occupies the entire input string. The second example fails because the input string contains extra whitespace at the beginning. The third example specifies an expression that allows for unlimited white space, followed by "dog" on the end of the line. The fourth example requires "dog" to be present at the beginning of a line followed by an unlimited number of word characters.


To check if a pattern begins and ends on a word boundary (as opposed to a substring within a longer string), just use\bon either side; for example,\bdog\b


```java
Enter your regex: \bdog\b
Enter input string to search: The dog plays in the yard.
I found the text "dog" starting at index 4 and ending at index 7.

Enter your regex: \bdog\b
Enter input string to search: The doggie plays in the yard.
No match found.
```


To match the expression on a non-word boundary, use\Binstead:


```java
Enter your regex: \bdog\B
Enter input string to search: The dog plays in the yard.
No match found.

Enter your regex: \bdog\B
Enter input string to search: The doggie plays in the yard.
I found the text "dog" starting at index 4 and ending at index 7.
```


To require the match to occur only at the end of the previous match, use\G:


```java
Enter your regex: dog 
Enter input string to search: dog dog
I found the text "dog" starting at index 0 and ending at index 3.
I found the text "dog" starting at index 4 and ending at index 7.

Enter your regex: \Gdog 
Enter input string to search: dog dog
I found the text "dog" starting at index 0 and ending at index 3.
```


Here the second example finds only one match, because the second occurrence of "dog" does not start at the end of the previous match.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/regex/pattern.html


Until now, we've only used the test harness to createPatternobjects in their most basic form. This section explores advanced techniques such as creating patterns with flags and using embedded flag expressions. It also explores some additional useful methods that we haven't yet discussed.


## Creating a Pattern with Flags


ThePatternclass defines an alternatecompilemethod that accepts a set of flags affecting the way the pattern is matched. The flags parameter is a bit mask that may include any of the following public static fields:

- Pattern.CANON_EQ Enables canonical equivalence. When this flag is specified, two characters will be considered to match if, and only if, their full canonical decompositions match. The expression "a\u030A" , for example, will match the string "\u00E5" when this flag is specified. By default, matching does not take canonical equivalence into account. Specifying this flag may impose a performance penalty.
- Pattern.CASE_INSENSITIVE Enables case-insensitive matching. By default, case-insensitive matching assumes that only characters in the US-ASCII charset are being matched. Unicode-aware case-insensitive matching can be enabled by specifying the UNICODE_CASE flag in conjunction with this flag. Case-insensitive matching can also be enabled via the embedded flag expression (?i) . Specifying this flag may impose a slight performance penalty.
- Pattern.COMMENTS Permits whitespace and comments in the pattern. In this mode, whitespace is ignored, and embedded comments starting with # are ignored until the end of a line. Comments mode can also be enabled via the embedded flag expression (?x) .
- Pattern.DOTALL Enables dotall mode. In dotall mode, the expression . matches any character, including a line terminator. By default this expression does not match line terminators. Dotall mode can also be enabled via the embedded flag expression (?s) . (The s is a mnemonic for "single-line" mode, which is what this is called in Perl.)
- Pattern.LITERAL Enables literal parsing of the pattern. When this flag is specified then the input string that specifies the pattern is treated as a sequence of literal characters. Metacharacters or escape sequences in the input sequence will be given no special meaning. The flags CASE_INSENSITIVE and UNICODE_CASE retain their impact on matching when used in conjunction with this flag. The other flags become superfluous. There is no embedded flag character for enabling literal parsing.
- Pattern.MULTILINE Enables multiline mode. In multiline mode the expressions ^ and $ match just after or just before, respectively, a line terminator or the end of the input sequence. By default these expressions only match at the beginning and the end of the entire input sequence. Multiline mode can also be enabled via the embedded flag expression (?m) .
- Pattern.UNICODE_CASE Enables Unicode-aware case folding. When this flag is specified then case-insensitive matching, when enabled by the CASE_INSENSITIVE flag, is done in a manner consistent with the Unicode Standard. By default, case-insensitive matching assumes that only characters in the US-ASCII charset are being matched. Unicode-aware case folding can also be enabled via the embedded flag expression (?u) . Specifying this flag may impose a performance penalty.
- Pattern.UNIX_LINES Enables UNIX lines mode. In this mode, only the '\n' line terminator is recognized in the behavior of . , ^ , and $ . UNIX lines mode can also be enabled via the embedded flag expression (?d) .

In the following steps we will modify the test harness,RegexTestHarness.javato create a pattern with case-insensitive matching.


First, modify the code to invoke the alternate version ofcompile:


```java
Pattern pattern = 
Pattern.compile(console.readLine("%nEnter your regex: "),
Pattern.CASE_INSENSITIVE);
```


Then compile and run the test harness to get the following results:


```java
Enter your regex: dog
Enter input string to search: DoGDOg
I found the text "DoG" starting at index 0 and ending at index 3.
I found the text "DOg" starting at index 3 and ending at index 6.
```


As you can see, the string literal "dog" matches both occurences, regardless of case. To compile a pattern with multiple flags, separate the flags to be included using the bitwise OR operator "|". For clarity, the following code samples hardcode the regular expression instead of reading it from theConsole:


```java
pattern = Pattern.compile("[az]$", Pattern.MULTILINE | Pattern.UNIX_LINES);
```


You could also specify anintvariable instead:


```java
final int flags = Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE;
Pattern pattern = Pattern.compile("aa", flags);
```


## Embedded Flag Expressions


It's also possible to enable various flags usingembedded flag expressions. Embedded flag expressions are an alternative to the two-argument version ofcompile, and are specified in the regular expression itself. The following example uses the original test harness,RegexTestHarness.javawith the embedded flag expression(?i)to enable case-insensitive matching.


```java
Enter your regex: (?i)foo
Enter input string to search: FOOfooFoOfoO
I found the text "FOO" starting at index 0 and ending at index 3.
I found the text "foo" starting at index 3 and ending at index 6.
I found the text "FoO" starting at index 6 and ending at index 9.
I found the text "foO" starting at index 9 and ending at index 12.
```


Once again, all matches succeed regardless of case.


The embedded flag expressions that correspond toPattern's publicly accessible fields are presented in the following table:


## Using thematches(String,CharSequence)Method


ThePatternclass defines a convenientmatchesmethod that allows you to quickly check if a pattern is present in a given input string. As with all public static methods, you should invokematchesby its class name, such asPattern.matches("\\d","1");. In this example, the method returnstrue, because the digit "1" matches the regular expression\d.


## Using thesplit(String)Method


Thesplitmethod is a great tool for gathering the text that lies on either side of the pattern that's been matched. As shown below inSplitDemo.java, thesplitmethod could extract the words "one two three four five" from the string "one:two:three:four:five":


```java
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class SplitDemo {

    private static final String REGEX = ":";
    private static final String INPUT =
        "one:two:three:four:five";
    
    public static void main(String[] args) {
        Pattern p = Pattern.compile(REGEX);
        String[] items = p.split(INPUT);
        for(String s : items) {
            System.out.println(s);
        }
    }
}
```


```java
OUTPUT:

one
two
three
four
five
```


For simplicity, we've matched a string literal, the colon (:) instead of a complex regular expression. Since we're still usingPatternandMatcherobjects, you can use split to get the text that falls on either side of any regular expression. Here's the same example,SplitDemo2.java, modified to split on digits instead:


```java
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class SplitDemo2 {

    private static final String REGEX = "\\d";
    private static final String INPUT =
        "one9two4three7four1five";

    public static void main(String[] args) {
        Pattern p = Pattern.compile(REGEX);
        String[] items = p.split(INPUT);
        for(String s : items) {
            System.out.println(s);
        }
    }
}
```


```java
OUTPUT:

one
two
three
four
five
```


## Other Utility Methods


You may find the following methods to be of some use as well:

- public static String quote(String s) Returns a literal pattern String for the specified String . This method produces a String that can be used to create a Pattern that would match String s as if it were a literal pattern. Metacharacters or escape sequences in the input sequence will be given no special meaning.
- public String toString() Returns the String representation of this pattern. This is the regular expression from which this pattern was compiled.

## Pattern Method Equivalents injava.lang.String


Regular expression support also exists injava.lang.Stringthrough several methods that mimic the behavior ofjava.util.regex.Pattern. For convenience, key excerpts from their API are presented below.

- public boolean matches(String regex) : Tells whether or not this string matches the given regular expression. An invocation of this method of the form str .matches( regex ) yields exactly the same result as the expression Pattern.matches( regex , str ) .
- public String[] split(String regex, int limit) : Splits this string around matches of the given regular expression. An invocation of this method of the form str .split( regex , n ) yields the same result as the expression Pattern.compile( regex ).split( str , n )
- public String[] split(String regex) : Splits this string around matches of the given regular expression. This method works the same as if you invoked the two-argument split method with the given expression and a limit argument of zero. Trailing empty strings are not included in the resulting array.

There is also a replace method, that replaces oneCharSequencewith another:

- public String replace(CharSequence target,CharSequence replacement) : Replaces each substring of this string that matches the literal target sequence with the specified literal replacement sequence. The replacement proceeds from the beginning of the string to the end, for example, replacing "aa" with "b" in the string "aaa" will result in "ba" rather than "ab".

---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/regex/matcher.html


This section describes some additional useful methods of theMatcherclass. For convenience, the methods listed below are grouped according to functionality.


## Index Methods


Index methodsprovide useful index values that show precisely where the match was found in the input string:

- public int start() : Returns the start index of the previous match.
- public int start(int group) : Returns the start index of the subsequence captured by the given group during the previous match operation.
- public int end() : Returns the offset after the last character matched.
- public int end(int group) : Returns the offset after the last character of the subsequence captured by the given group during the previous match operation.

## Study Methods


Study methodsreview the input string and return a boolean indicating whether or not the pattern is found.

- public boolean lookingAt() : Attempts to match the input sequence, starting at the beginning of the region, against the pattern.
- public boolean find() : Attempts to find the next subsequence of the input sequence that matches the pattern.
- public boolean find(int start) : Resets this matcher and then attempts to find the next subsequence of the input sequence that matches the pattern, starting at the specified index.
- public boolean matches() : Attempts to match the entire region against the pattern.

## Replacement Methods


Replacement methodsare useful methods for replacing text in an input string.

- public Matcher appendReplacement(StringBuffer sb, String replacement) : Implements a non-terminal append-and-replace step.
- public StringBuffer appendTail(StringBuffer sb) : Implements a terminal append-and-replace step.
- public String replaceAll(String replacement) : Replaces every subsequence of the input sequence that matches the pattern with the given replacement string.
- public String replaceFirst(String replacement) : Replaces the first subsequence of the input sequence that matches the pattern with the given replacement string.
- public static String quoteReplacement(String s) : Returns a literal replacement String for the specified String . This method produces a String that will work as a literal replacement s in the appendReplacement method of the Matcher class. The String produced will match the sequence of characters in s treated as a literal sequence. Slashes ( '\' ) and dollar signs ( '$' ) will be given no special meaning.

## Using thestartandendMethods


Here's an example,MatcherDemo.java, that counts the number of times the word "dog" appears in the input string.


```java
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class MatcherDemo {

    private static final String REGEX =
        "\\bdog\\b";
    private static final String INPUT =
        "dog dog dog doggie dogg";

    public static void main(String[] args) {
       Pattern p = Pattern.compile(REGEX);
       //  get a matcher object
       Matcher m = p.matcher(INPUT);
       int count = 0;
       while(m.find()) {
           count++;
           System.out.println("Match number "
                              + count);
           System.out.println("start(): "
                              + m.start());
           System.out.println("end(): "
                              + m.end());
      }
   }
}
```


```java
OUTPUT:

Match number 1
start(): 0
end(): 3
Match number 2
start(): 4
end(): 7
Match number 3
start(): 8
end(): 11
```


You can see that this example uses word boundaries to ensure that the letters"d" "o" "g"are not merely a substring in a longer word. It also gives some useful information about where in the input string the match has occurred. Thestartmethod returns the start index of the subsequence captured by the given group during the previous match operation, andendreturns the index of the last character matched, plus one.


## Using thematchesandlookingAtMethods


ThematchesandlookingAtmethods both attempt to match an input sequence against a pattern. The difference, however, is thatmatchesrequires the entire input sequence to be matched, whilelookingAtdoes not. Both methods always start at the beginning of the input string. Here's the full code,MatchesLooking.java:


```java
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class MatchesLooking {

    private static final String REGEX = "foo";
    private static final String INPUT =
        "fooooooooooooooooo";
    private static Pattern pattern;
    private static Matcher matcher;

    public static void main(String[] args) {
   
        // Initialize
        pattern = Pattern.compile(REGEX);
        matcher = pattern.matcher(INPUT);

        System.out.println("Current REGEX is: "
                           + REGEX);
        System.out.println("Current INPUT is: "
                           + INPUT);

        System.out.println("lookingAt(): "
            + matcher.lookingAt());
        System.out.println("matches(): "
            + matcher.matches());
    }
}
```


```java
Current REGEX is: foo
Current INPUT is: fooooooooooooooooo
lookingAt(): true
matches(): false
```


## UsingreplaceFirst(String)andreplaceAll(String)


ThereplaceFirstandreplaceAllmethods replace text that matches a given regular expression. As their names indicate,replaceFirstreplaces the first occurrence, andreplaceAllreplaces all occurrences. Here's theReplaceDemo.javacode:


```java
import java.util.regex.Pattern; 
import java.util.regex.Matcher;

public class ReplaceDemo {
 
    private static String REGEX = "dog";
    private static String INPUT =
        "The dog says meow. All dogs say meow.";
    private static String REPLACE = "cat";
 
    public static void main(String[] args) {
        Pattern p = Pattern.compile(REGEX);
        // get a matcher object
        Matcher m = p.matcher(INPUT);
        INPUT = m.replaceAll(REPLACE);
        System.out.println(INPUT);
    }
}
```


```java
OUTPUT: The cat says meow. All cats say meow.
```


In this first version, all occurrences ofdogare replaced withcat. But why stop here? Rather than replace a simple literal likedog, you can replace text that matchesanyregular expression. The API for this method states that "given the regular expressiona*b, the inputaabfooaabfooabfoob, and the replacement string-, an invocation of this method on a matcher for that expression would yield the string-foo-foo-foo-."


Here's theReplaceDemo2.javacode:


```java
import java.util.regex.Pattern;
import java.util.regex.Matcher;
 
public class ReplaceDemo2 {
 
    private static String REGEX = "a*b";
    private static String INPUT =
        "aabfooaabfooabfoob";
    private static String REPLACE = "-";
 
    public static void main(String[] args) {
        Pattern p = Pattern.compile(REGEX);
        // get a matcher object
        Matcher m = p.matcher(INPUT);
        INPUT = m.replaceAll(REPLACE);
        System.out.println(INPUT);
    }
}
```


```java
OUTPUT: -foo-foo-foo-
```


To replace only the first occurrence of the pattern, simply callreplaceFirstinstead ofreplaceAll. It accepts the same parameter.


## UsingappendReplacement(StringBuffer,String)andappendTail(StringBuffer)


TheMatcherclass also providesappendReplacementandappendTailmethods for text replacement. The following example,RegexDemo.java, uses these two methods to achieve the same effect asreplaceAll.


```java
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class RegexDemo {
 
    private static String REGEX = "a*b";
    private static String INPUT = "aabfooaabfooabfoob";
    private static String REPLACE = "-";
 
    public static void main(String[] args) {
        Pattern p = Pattern.compile(REGEX);
        Matcher m = p.matcher(INPUT); // get a matcher object
        StringBuffer sb = new StringBuffer();
        while(m.find()){
            m.appendReplacement(sb,REPLACE);
        }
        m.appendTail(sb);
        System.out.println(sb.toString());
    }
}
```


```java
OUTPUT: -foo-foo-foo-
```


## Matcher Method Equivalents injava.lang.String


For convenience, theStringclass mimics a couple ofMatchermethods as well:

- public String replaceFirst(String regex, String replacement) : Replaces the first substring of this string that matches the given regular expression with the given replacement. An invocation of this method of the form str .replaceFirst( regex , repl ) yields exactly the same result as the expression Pattern.compile( regex ).matcher( str ).replaceFirst( repl )
- public String replaceAll(String regex, String replacement) : Replaces each substring of this string that matches the given regular expression with the given replacement. An invocation of this method of the form str .replaceAll( regex , repl ) yields exactly the same result as the expression Pattern.compile( regex ).matcher( str ).replaceAll( repl )

---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/regex/pse.html


APatternSyntaxExceptionis an unchecked exception that indicates a syntax error in a regular expression pattern. ThePatternSyntaxExceptionclass provides the following methods to help you determine what went wrong:

- public String getDescription() : Retrieves the description of the error.
- public int getIndex() : Retrieves the error index.
- public String getPattern() : Retrieves the erroneous regular expression pattern.
- public String getMessage() : Returns a multi-line string containing the description of the syntax error and its index, the erroneous regular-expression pattern, and a visual indication of the error index within the pattern.

The following source code,RegexTestHarness2.java, updates our test harness to check for malformed regular expressions:


```java
import java.io.Console;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.util.regex.PatternSyntaxException;

public class RegexTestHarness2 {

    public static void main(String[] args){
        Pattern pattern = null;
        Matcher matcher = null;

        Console console = System.console();
        if (console == null) {
            System.err.println("No console.");
            System.exit(1);
        }
        while (true) {
            try{
                pattern = 
                Pattern.compile(console.readLine("%nEnter your regex: "));

                matcher = 
                pattern.matcher(console.readLine("Enter input string to search: "));
            }
            catch(PatternSyntaxException pse){
                console.format("There is a problem" +
                               " with the regular expression!%n");
                console.format("The pattern in question is: %s%n",
                               pse.getPattern());
                console.format("The description is: %s%n",
                               pse.getDescription());
                console.format("The message is: %s%n",
                               pse.getMessage());
                console.format("The index is: %s%n",
                               pse.getIndex());
                System.exit(0);
            }
            boolean found = false;
            while (matcher.find()) {
                console.format("I found the text" +
                    " \"%s\" starting at " +
                    "index %d and ending at index %d.%n",
                    matcher.group(),
                    matcher.start(),
                    matcher.end());
                found = true;
            }
            if(!found){
                console.format("No match found.%n");
            }
        }
    }
}
```


To run this test, enter?i)fooas the regular expression. This mistake is a common scenario in which the programmer has forgotten the opening parenthesis in the embedded flag expression(?i). Doing so will produce the following results:


```java
Enter your regex: ?i)
There is a problem with the regular expression!
The pattern in question is: ?i)
The description is: Dangling meta character '?'
The message is: Dangling meta character '?' near index 0
?i)
^
The index is: 0
```


From this output, we can see that the syntax error is a dangling metacharacter (the question mark) at index 0. A missing opening parenthesis is the culprit.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/regex/unicode.html


As of the JDK 7 release, Regular Expression pattern matching has expanded functionality to support Unicode 6.0.

- Matching a Specific Code Point
- Unicode Character Properties

## Matching a Specific Code Point


You can match a specific Unicode code point using an escape sequence of the form\uFFFF, whereFFFFis the hexadecimal value of the code point you want to match. For example,\u6771matches the Han character for east.


Alternatively, you can specify a code point using Perl-style hex notation,\x{...}. For example:


```java
String hexPattern = "\x{" + Integer.toHexString(codePoint) + "}";
```


## Unicode Character Properties


Each Unicode character, in addition to its value, has certain attributes, or properties. You can match a single character belonging to a particular category with the expression\p{prop}. You can match a single characternotbelonging to a particular category with the expression\P{prop}.


The three supported property types are scripts, blocks, and a "general" category.


### Scripts


To determine if a code point belongs to a specific script, you can either use thescriptkeyword, or thescshort form, for example,\p{script=Hiragana}. Alternatively, you can prefix the script name with the stringIs, such as\p{IsHiragana}.


Valid script names supported byPatternare those accepted byUnicodeScript.forName.


### Blocks


A block can be specified using theblockkeyword, or theblkshort form, for example,\p{block=Mongolian}. Alternatively, you can prefix the block name with the stringIn, such as\p{InMongolian}.


Valid block names supported byPatternare those accepted byUnicodeBlock.forName.


### General Category


Categories can be specified with optional prefixIs. For example,IsLmatches the category of Unicode letters. Categories can also be specified by using thegeneral_categorykeyword, or the short formgc. For example, an uppercase letter can be matched usinggeneral_category=Luorgc=Lu.


Supported categories are those ofThe Unicode Standardin the version specified by theCharacterclass.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/regex/resources.html


Now that you've completed this lesson on regular expressions, you'll probably find that your main references will be the API documentation for the following classes:Pattern,Matcher, andPatternSyntaxException.


For a more precise description of the behavior of regular expression constructs, we recommend reading the bookMastering Regular Expressionsby Jeffrey E. F. Friedl.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/regex/QandE/questions.html


## Questions

- What are the three public classes in the java.util.regex package? Describe the purpose of each.
- Consider the string literal "foo" . What is the start index? What is the end index? Explain what these numbers mean.
- What is the difference between an ordinary character and a metacharacter? Give an example of each.
- How do you force a metacharacter to act like an ordinary character?
- What do you call a set of characters enclosed in square brackets? What is it for?
- Here are three predefined character classes: \d , \s , and \w . Describe each one, and rewrite it using square brackets.
- For each of \d , \s , and \w , write two simple expressions that match the opposite set of characters.
- Consider the regular expression (dog){3} . Identify the two subexpressions. What string does the expression match?

## Exercises

- Use a backreference to write an expression that will match a person's name only if that person's first name and last name are the same.

Check your answers.


---

### 📄 Source: https://docs.oracle.com/javase/tutorial/essential/end.html


You have reached the end of the "Essential Java Classes" trail.


If you have comments or suggestions about this trail,
use ourfeedback pageto tell us about it.


Creating a GUI With Swing: Once you know how to create applications or applets, follow this trail to learn how to create their user interfaces.


Collections: Using the classes and interfaces in the collections framework you can group objects together into a single object.


Internationalization: Essential if you want to create a program that can be used by people all over the world. Furthermore, you can use the information about formatting dates, numbers, and strings in any program.
