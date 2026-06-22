-- Create the questions table if it doesn't exist yet
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    topic VARCHAR(50) NOT NULL,
    question_text TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE
);

-- Clear any existing rows to prevent duplicate primary key blocks on initial sandbox setup
TRUNCATE TABLE questions RESTART IDENTITY CASCADE;

-- Insert all 27 DevOps interview questions
INSERT INTO questions (topic, question_text, answer_text, is_approved) VALUES
-- Networking
('networking', 'What is the difference between TCP and UDP?', 'TCP is a connection-oriented protocol that guarantees delivery via handshakes, sequencing, and error-checking, making it ideal for web and database traffic. UDP is a connectionless protocol that fires packets without verification, prioritizing speed over reliability, which is ideal for streaming or DNS.', true),
('networking', 'What happens during a TCP three-way handshake?', 'The client sends a SYN packet to the server to synchronize sequence numbers. The server responds with a SYN-ACK to acknowledge the request. Finally, the client sends an ACK packet back, establishing a reliable network connection.', true),
('networking', 'What is the purpose of CIDR notation in IP routing?', 'CIDR (Classless Inter-Domain Routing) specifies an IP address and its associated network mask using a slash followed by a number (e.g., /24). The number indicates how many bits are allocated to the network prefix, dictating the size of the subnet and the total number of available host IPs.', true),

-- Linux Internals
('linux', 'Explain the difference between a hard link and a soft link (symlink).', 'A hard link points directly to the exact same underlying inode on the storage disk, sharing permissions and file data even if the original file name is deleted. A soft link is a distinct shortcut file that points to a path string name; if the target file is deleted, the symlink breaks.', true),
('linux', 'What is an inode in a Linux file system?', 'An inode (index node) is a data structure on a Linux file system that stores metadata about a file, including its size, owner, permissions, and disk block locations. Crucially, it stores everything except the file''s actual data contents or its filename.', true),
('linux', 'How do you troubleshoot a process that is consuming too much memory but won''t terminate with SIGTERM?', 'If a process ignores SIGTERM (signal 15), which allows for graceful cleanup, you use kill -9 or SIGKILL. This instructs the Linux kernel to immediately drop the process from execution memory and clear its process table allocation without waiting for it to clean up hooks.', true),

-- Kubernetes
('k8s', 'What is the fundamental difference between a Pod and a Deployment?', 'A Pod is the smallest deployable unit in Kubernetes, hosting one or more closely coupled containers. A Deployment is a higher-level controller that manages Pod lifecycles, handling rolling updates, self-healing, scaling replicas, and rollbacks automatically.', true),
('k8s', 'How does a Kubernetes Service discover Pods dynamically?', 'Kubernetes Services use Selectors to track target Pods matching specific Labels (e.g., app: backend). The Service continuously queries the API server to maintain an updated list of active Pod IPs in an internal routing object called an Endpoints resource.', true),
('k8s', 'What is the role of the Kubelet on a worker node?', 'The Kubelet is an agent that runs on every worker node in the cluster. It watches the API server for Pod definitions assigned to its node and directly instructs the container runtime (like containerd or Docker) to spin up, monitor, and maintain the status of those containers.', true),

-- Terraform
('terraform', 'Why is the Terraform State file (terraform.tfstate) critical, and how should it be secured?', 'The state file acts as Terraform''s source of truth, mapping your declarative configuration files to real, active resources provisioned in the cloud. It must be secured using remote backend storage (like Amazon S3) with state-locking enabled (via DynamoDB) to prevent concurrent updates and encryption to safeguard sensitive variables.', true),
('terraform', 'What is the difference between terraform plan and terraform apply?', 'terraform plan is a dry-run execution that reads your code and evaluates the delta against live infrastructure, outputting an execution preview without making changes. terraform apply executes that plan, making actual API calls to the provider to provision, modify, or destroy infrastructure.', true),
('terraform', 'Explain the difference between a Provisioner and a Provider in Terraform.', 'A Provider is a plugin that abstracts cloud infrastructure APIs (like AWS, Azure, or GCP) so Terraform can deploy resources. A Provisioner is a post-deployment mechanism used to execute shell scripts or configuration management tools (like Ansible) directly inside a resource after it is spun up.', true),

-- CI/CD
('ci-cd', 'What is the core difference between Continuous Delivery and Continuous Deployment?', 'Both automate the build, test, and staging process. However, in Continuous Delivery, every successful build requires a manual approval step before launching into live production. In Continuous Deployment, every single commit that passes the pipeline automatically pushes straight to live production without manual intervention.', true),
('ci-cd', 'How do you protect sensitive credentials (like AWS keys or Docker passwords) inside a GitHub Actions pipeline?', 'Credentials should never be hardcoded into configuration files. They must be stored securely within GitHub''s Encrypted Secrets vault at the repository or organization level. Within the YAML workflow file, they are evaluated securely at runtime using the context syntax ${{ secrets.SECRET_NAME }}.', true),
('ci-cd', 'What is a "Runner" in the context of a CI/CD pipeline engine?', 'A runner is an execution server or agent container that polls the CI/CD orchestrator for pending jobs, clones the repository, sets up environment dependencies, and executes the specific sequential shell steps defined in your pipeline manifest.', true),

-- AWS Cloud
('aws', 'What is the structural difference between an AWS Region and an Availability Zone (AZ)?', 'An AWS Region is a geographic hub located somewhere in the world containing multiple, distinct data centers. An Availability Zone is an isolated cluster of one or more physical data center facilities inside a Region, equipped with independent power, cooling, and networking to ensure high availability.', true),
('aws', 'Explain the difference between a Public Subnet and a Private Subnet inside an Amazon VPC.', 'A Public Subnet contains a routing table route that directs outbound internet traffic through an Internet Gateway (IGW), assigning instances public IPs. A Private Subnet has no direct route to the internet; instances inside it utilize a NAT Gateway located in a public subnet to fetch external updates securely without exposing themselves.', true),
('aws', 'How does AWS IAM evaluate authorization policies?', 'IAM uses an explicit "Deny by Default" evaluation logic. When an API request is made, IAM checks all applicable policies: if there is an explicit Deny statement anywhere, the request is instantly rejected. If no explicit deny exists, it must find an explicit Allow statement to authorize the action.', true),

-- Observability
('observability', 'What are the "Three Pillars of Observability"?', 'The pillars are Metrics (numeric telemetry values over time indicating system health, like CPU utilization), Logs (timestamped discrete text lines documenting application system events), and Traces (end-to-end operational path records tracking a specific request as it crosses microservices).', true),
('observability', 'What is the difference between Monitoring and Observability?', 'Monitoring is a passive practice that tells you when a system is failing based on predefined thresholds and known metrics (e.g., "Is CPU > 80%?"). Observability is an active internal state evaluation that allows you to infer why a system is behaving weirdly under unknown conditions by analyzing comprehensive telemetry data.', true),
('observability', 'Explain the concepts of Prometheus Scraping vs Push-based telemetry collectors.', 'Prometheus uses a Pull-based model, where the monitoring server actively scrapes metrics at set intervals by making HTTP calls to an open /metrics endpoint on your application pods. A Push-based model requires an agent on your application server to actively package and ship metrics out to a central ingest engine (like Datadog or Splunk).', true),

-- DevSecOps
('devsecops', 'What is the difference between SAST and DAST in a security pipeline?', 'SAST (Static Application Security Testing) is an inside-out approach that scans your raw source code files for syntax flaws and vulnerabilities before compilation. DAST (Dynamic Application Security Testing) is an outside-in approach that attacks a running instance of your application externally, mimicking live security exploits.', true),
('devsecops', 'Explain the "Shift Left" security principle.', '"Shift Left" means introducing security testing, vulnerability scanning, and compliance checks as early as possible in the software development lifecycle (to the "left" of the timeline)—such as on local commit or pull request phases—rather than waiting for production deployment reviews.', true),
('devsecops', 'What is a container image vulnerability scanner, and how does it secure a Docker pipeline?', 'A scanner (like Trivy or Grype) checks the binary layers and software packages inside a compiled container image against public CVE databases. Integrating it into your pipeline ensures that images containing outdated binaries or high-severity security vulnerabilities are blocked before they are pushed to production registries.', true),

-- Behavioral
('behavioral', 'Describe a time you faced a production outage or critical bug. How did you isolate and resolve it?', 'The candidate should demonstrate a structured troubleshooting methodology: checking application logs, isolating dependencies, establishing a temporary workaround to restore service quickly, and then conducting a root-cause analysis to prevent it from happening again.', true),
('behavioral', 'How do you handle a situation where a developer insists their code is fine, but it keeps failing inside the CI/CD pipeline?', 'The answer should emphasize collaborative problem-solving rather than finger-pointing. Offer to pair-program, walk through the runner logs together to isolate environmental differences between their laptop and the pipeline, and align container requirements.', true),
('behavioral', 'How do you prioritize tasks when you have a critical infrastructure vulnerability deployment overlapping with an urgent feature release?', 'Production system stability and infrastructure data security almost always take absolute priority over new feature increments. The ideal response explains assessing the security threat blast radius, mitigating the security vulnerability immediately, and setting clear timing expectations with product managers.', true);